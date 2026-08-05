import {Router,Response } from "express";
import {authenticateToken,AuthRequest } from "../middleware/auth.js";
import {addToWishlist,getUserWishlist} from "../db/database.js";

const router = Router();

router.post(
    "/",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
        try {
            const {item_id} = req.body;
            const result = await addToWishlist( req.user.id, item_id);
            res.json({
                success: true,
                result
            });
        }catch (error) {
            res.status(500).json({
                success: false
            });
        }
    });





router.get(
    "/user/:id",
    async (req, res) => {
        try {
            const wishlist =await getUserWishlist(Number(req.params.id));
            res.json({
                success: true,
                wishlist
            });
        } catch (error) {
            res.status(500).json({
                success: false
            });
        }
    });

export default router;