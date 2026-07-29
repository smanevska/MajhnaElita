import {Request, Response, NextFunction, Router} from "express";
import {authUser, createUser} from "../db/database.js";

const router =Router();

// LOGIN
const loginUser=async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
        return res.status(200).json({
            success:true,
            message:"Login successful.",
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            }
        });
    } catch(error) {
        next(error);
    }
};

// REGISTER
const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
        }=req.body as {
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

        //nsert user into database
        const queryResult =await createUser(
            first_name,
            last_name,
            email,
            password,

        );
        // 6. Registration successful
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

router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;