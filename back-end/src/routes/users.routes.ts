import {Request, Response, NextFunction, Router} from "express";
import {authUser, createUser, getUserById, updateUserProfile,updatePassword,getLeaderboard} from "../db/database.js";
import jwt from "jsonwebtoken";
import {authenticateToken, AuthRequest} from "../middleware/auth.js";
import multer from "multer";
const router =Router();

const storage=multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/profiles/");},
    filename(req, file, cb) {
        cb(null, Date.now() + "-" +file.originalname);
    }
});
const upload = multer({storage});

// Login
const loginUser=async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const {email, password}=req.body as {
            email?: string;
            password?: string;
        };
        // if email and password were entered
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }
        //Find user by email, function from database.ts
        const queryResult=await authUser(email);
        //If user does not exist
        if (queryResult.length ===0) {
            return res.status(401).json({
                success: false,
                message:"User is not registered."
            });
        }
        const user = queryResult[0];
        // Check password
        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password."
            });
        }
        // Login successful
        const token = jwt.sign(
        {   id: user.id,
            email: user.email },
        process.env.JWT_SECRET!,
        {  expiresIn: "180d" }
    );
        return res.status(200).json({
            success:true,
            message:"Login successful.",
            token: token
        });
    } catch(error) {
        next(error);
    }
};

//register
const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction)=> {
    try {
        const {first_name,last_name,email,password}
        =req.body as {
            first_name?: string;
            last_name?: string;
            email?: string;
            password?: string;
        };
        //Check required fields
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "First name, last name, email and password are required."
            });
        }
        //Password must contain at least 8 characters
        if (password.length <8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }
        //Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format."
            });
        }

        //Check if email is already registered
        const existingUser=await authUser(email);
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        //insert user into database
        const queryResult =await createUser(
            first_name,
            last_name,
            email,
            password,

        );
        //Registration successful
        if (queryResult.affectedRows === 1) {
            return res.status(201).json({
                success: true,
                message: "User registered successfully."
            });
        }
        //Something went wrong during insertion
        return res.status(500).json({
            success: false,
            message: "User was not registered."
        });
    } catch(error) {
        next(error);
    }
};


//get current user
const getCurrentUser=async(
    req:AuthRequest,
    res:Response,
    next:NextFunction
) =>{
    try {
        const userId=req.user.id;
        const queryResult = await getUserById(userId);
        if (queryResult.length === 0){
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        return res.status(200).json({
            success: true,
            user: queryResult[0]
        });
    } catch(error){
        next(error);
    }
};


//Profile Managing in Settings
const updateProfile=async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try{
        const userId=req.user.id;
        const { phone, location}=req.body;

        const currentUser=await getUserById(userId); //Get current user data from database
        const profile_picture = req.file
            ? "uploads/profiles/" + req.file.filename
            : currentUser[0].profile_picture;//If a new image was uploaded use it,otherwise keep the existing profile picture
        const queryResult=await updateUserProfile(
            userId,
            phone || "",
            location || "",
            profile_picture
        );
        if(queryResult.affectedRows === 1){
            return res.status(200).json({
                success:true,
                message:"Profile updated."
            });
        }
        return res.status(404).json({
            success:false,
            message:"User not found."
        });
    }catch(error){
        next(error);
    }
};

// Change password for authenticated user
const changePassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction) => {
    try{
        const userId = req.user.id;
        const {currentPassword, newPassword,confirmPassword} = req.body;
        const users = await getUserById(req.user.id);
        const user = users[0];
        if(currentPassword !== user.password){
            return res.status(401).json({
                success:false,
                message:"Current password is incorrect."
            });
        }
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match."
            });
        }
        await updatePassword(
            userId,
            newPassword
        );
        return res.status(200).json({
            success:true,
            message:"Password updated successfully."
        });
    }catch(error){
        next(error);
    }
};


// Get public profile information of a user by ID
const getUserProfileById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = Number(req.params.id);
        const queryResult = await getUserById(userId);
        if (queryResult.length === 0) {
            return res.status(404).json({
                success:false,
                message:"User not found."
            });
        }
        return res.status(200).json({
            success:true,
            user:queryResult[0]
        });
    } catch(error) {
        next(error);
    }
};
// Get leaderboard,returns users ranked by donation points
const Leaderboard = async (
    req:Request,
    res:Response,
    next: NextFunction
) => {
    try {
        const users = await getLeaderboard();
        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        next(error);
    }
};


router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/leaderboard",Leaderboard);
router.get("/me", authenticateToken, getCurrentUser);
router.put("/profile", authenticateToken,upload.single("profile_picture"), updateProfile);
router.put("/password", authenticateToken,changePassword);
router.get("/:id", getUserProfileById);

export default router;