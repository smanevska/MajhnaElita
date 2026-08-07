import {Router,Response } from "express";
import {authenticateToken,AuthRequest } from "../middleware/auth.js";
import {addToWishlist,getUserWishlist,removeFromWishlist, checkWishlist} from "../db/database.js";

const router = Router();
//Add or remove an item from the logged in user's wishlist
router.post("/toggle",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {
        try {
            const { item_id }=req.body;
            const exists = await checkWishlist(req.user.id,  item_id );
            if (exists) {
                await removeFromWishlist(
                    req.user.id,
                    item_id
                );
                res.json({
                    success: true,
                    saved: false
                });
            } else {
                await addToWishlist(
                    req.user.id,
                    item_id
                );
                res.json({
                    success: true,
                    saved: true
                });
            }
        }catch (error) {
            res.status(500).json({
                success: false
            });
        }
    });
//Get the wishlist of the currently logged-in user
router.get("/my",
    authenticateToken,
    async(req:AuthRequest,res:Response)=>{
        try{
           const wishlist = await getUserWishlist(req.user.id);
            res.json({
                success:true,
                wishlist
            });
        }catch(error){
            res.status(500).json({
                success:false
            });
        } }
);

export default router;