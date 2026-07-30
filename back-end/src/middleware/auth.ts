import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request{
    user?: any;
}
export function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {

    const authHeader=req.headers.authorization;
    const token =authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Not authenticated"
        });
    }


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