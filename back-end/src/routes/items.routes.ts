import { Router, Request, Response } from "express";
import multer from "multer";
import { createItem, getItemsByUser,getPublishedItems,deleteItem,getItemsByUserId,createDonation,addUserPoints,getDonationByItemId, removeUserPoints} from "../db/database.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";
const router = Router();

//where uploaded item images will be stored
const storage =multer.diskStorage({
    destination:(req, file, callback) => {
        callback(null, "uploads/items/"); },
    filename: (req, file, callback) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        callback(null, fileName);
    }
});

const upload =multer({storage});
//Create a new item
router.post(
    "/",
    authenticateToken,
    upload.single("image"),
    async (req: AuthRequest, res: Response) => {

        try {
            const userId = req.user.id;
            const {
                title,
                description,
                size,
                gender,
                conditionn,
                age_group,
                item_type_id,
                item_price,
                category,
                location,
                rental_start,
                rental_end
            } = req.body;

            //saved image path if the user uploaded an image
            const imagePath = req.file
                ? `uploads/items/${req.file.filename}`
                : "";
            const itemType = item_type_id ? Number(item_type_id) : null;
            const result= await createItem(
                title,
                description,
                size,
                imagePath,
                gender,
                conditionn,
                age_group,
                itemType,
                item_price ? Number(item_price) : null,
                category,
                location,
                userId,
                rental_start || null,
                rental_end || null
            );
            const itemId = result.insertId;
            // If item is a donation give 2 points
            if(itemType === 3){
            await createDonation(userId,itemId,2);
            await addUserPoints(userId,2);
}
            res.json({
                success: true,
                message: "Item published successfully"
            });

        } catch (error) {
            console.log("Error creating item:", error);

            res.status(500).json({
                success: false,
                message: "Failed to create item"
            });
        }
    }
);

router.get("/user/:id",async(
    req:Request,
    res:Response )=>{
    try{
        const userId = Number(req.params.id);
        const items = await getItemsByUserId(userId);
        res.status(200).json({
            success:true,
            items
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Could not load user items"
        });
    }
});

router.get(
    "/my",
    authenticateToken,
    async (req: AuthRequest, res: Response) => {

        try {
            const items = await getItemsByUser(
                req.user.id
            );
            res.json({
                success: true,
                items
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false
            });
        }
    });

router.delete("/:id",
    authenticateToken,
    async (req: AuthRequest, res) => {
        try {
            const itemId = Number(req.params.id);
            const donation =await getDonationByItemId(itemId);
            // first delete only if owner
            const result = await deleteItem(
                itemId,
                req.user.id
            );
            if (result.affectedRows === 0) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot delete this item"
                });
            }
            // now remove donation points
            //const donation = await getDonationByItemId(itemId);
            if (donation.length > 0) {
                console.log("Removing points:", donation[0].points_awarded,"from user:",donation[0].user_id);
                await removeUserPoints(
                    donation[0].user_id,
                    donation[0].points_awarded
                );
            }
            res.json({
                success: true,
                message: "Item deleted successfully"
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Delete failed"
            });
        }
    });

    
router.get(
    "/",
    async (req, res) => {
        try {
            const items = await getPublishedItems();
            res.json({
                success: true,
                items
            });
        }catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: "Cannot load items"
            });
        }
});


export default router;