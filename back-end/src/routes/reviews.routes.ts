import { Router, Response } from "express";
import {createReview,getReviewsByUser,getReviewsByItem,getItemById}from "../db/database.js";
import {authenticateToken,AuthRequest} from "../middleware/auth.js";
const router=Router();

//create a review for a sold item 
router.post("/",
    authenticateToken,
    async (req:AuthRequest, res:Response)=>{
        try {
            const {rating, comment, item_id } =req.body;
            const item =await getItemById(item_id);
            if (!item || item.status !== "sold"){
                return res.status(400).json({
                    success:false,
                    message:"Only sold items can be reviewed"
                });
            }
            const result = await createReview(
                rating,
                comment,
                req.user.id,
                item_id
            );
            res.json({
                success:true,
                review:result
            });
        }catch (error){
            console.log(error);
            res.status(500).json({
                success: false
            });
        }
    });

//get all reviews received by a specific user
router.get( "/user/:id",
    async (req, res)=>{
        try {
            const reviews =await getReviewsByUser( Number(req.params.id));
            res.json({
                success: true,
                reviews
            });
        }catch (error) {
            res.status(500).json({
                success: false
            });
        }
    });

//get all reviews for a specific item
router.get( "/item/:id",
    async (req, res) => {
        try {
            const reviews = await getReviewsByItem(Number(req.params.id));
            res.json({
                success: true,
                reviews
            });
        }catch(error){
            res.status(500).json({
                success: false
            });
        }
    });

export default router;