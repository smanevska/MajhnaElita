import { Router, Request, Response } from "express";
import multer from "multer";
import { createItem, getItemsByUser } from "../db/database.js";
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
                location
            } = req.body;

            //saved image path if the user uploaded an image
            const imagePath = req.file
                ? `uploads/items/${req.file.filename}`
                : "";

            await createItem(
                title,
                description,
                size,
                imagePath,
                gender,
                conditionn,
                age_group,
                item_type_id ? Number(item_type_id) : null,
                item_price ? Number(item_price) : null,
                category,
                location,
                userId
            );

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

export default router;