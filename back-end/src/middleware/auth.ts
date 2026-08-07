import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

// Adds a user property where we store the information from the verified JWT token
export interface AuthRequest extends Request{
    user?: any;
}
//checks if the user has a valid JWT token
export function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader=req.headers.authorization;    //get the Authorization header sent from frontend
    const token =authHeader?.split(" ")[1];
    //If there is no token, user is not logged in
    if (!token) {
        return res.status(401).json({
            message: "Not authenticated"
        });
    }
    //verify that the token is valid
    jwt.verify(
        token,
        process.env.JWT_SECRET!,
        (error, user) => {
            if (error){
                return res.status(403).json({
                    message: "Invalid token"
                });
            }
            req.user = user;
            next();
        }
    );
}