import mysql from "mysql2/promise";
//creating database connection
const pool=mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});

//user authentication and account
export async function authUser(email:string){
    const [rows] = await pool.query(
       `SELECT *
        FROM user
        WHERE email=? `,
        [email]
    );
    return rows as any[];
}

export async function createUser(
    first_name:string,
    last_name:string,
    email:string,
    password:string
){  const [result]=await pool.query(
        `INSERT INTO user
        (first_name, last_name, email, password )
        VALUES (?,?,?,?)`,
        [   first_name,
            last_name,
            email,
            password   
        ]
    );
    return result as any;
}

export async function getUserById(id:number){
    const [rows] = await pool.query(
        `SELECT
            id,
            first_name,
            last_name,
            email,
            password,
            phone,
            location,
            profile_picture,
            points
        FROM user
        WHERE id = ? `,
        [id]
    );
    return rows as any[];
}

//user profile and settings
export async function updateUserProfile(
    id: number,
    phone: string,
    location: string,
    profile_picture: string
){
    const [result] = await pool.query(
        `UPDATE user
        SET
            phone = ?,
            location = ?,
            profile_picture = ?
        WHERE id = ?`,
           [ phone,
            location,
            profile_picture,
            id  ]
    );

    return result as any;
}

export async function updatePassword(
    id:number,
    newPassword:string
){  const [result] = await pool.query(
        `UPDATE user
        SET password = ?
        WHERE id = ?`,
        [newPassword,id]
    );
    return result as any;
}

//item management
export async function createItem(
    title:string,
    description:string,
    size:string,
    image:string,
    gender:string,
    conditionn:string,
    age_group:string,
    item_type_id:number,
    item_price:number,
    category:string,
    location:string,
    user_id:number,
    rental_start:string | null,
    rental_end:string | null
){
const [result] = await pool.query(
    `INSERT INTO item (
        title,
        description,
        size,
        image,
        gender,
        conditionn,
        age_group,
        item_type_id,
        item_price,
        category,
        location,
        user_id,
        status,
        rental_start,
        rental_end )
VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `,
[       title,
        description,
        size,
        image,
        gender,
        conditionn,
        age_group,
        item_type_id,
        item_price,
        category,
        location,
        user_id,
    "published",
    rental_start,
    rental_end]);
return result as any;
}

export async function getItemsByUser(userId:number){
    const [rows] = await pool.query(
        `SELECT *
        FROM item
        WHERE user_id=?
        ORDER BY id DESC`,
        [userId]
    );

    return rows;
}
export async function getItemsByUserId(userId:number){
    const [rows] = await pool.query(
        `SELECT *
        FROM item
        WHERE user_id = ?
        ORDER BY id DESC`,
        [userId]
    );
    return rows as any[];
}
export async function getPublishedItems(){
    const [rows] = await pool.query(
        `SELECT item.*,
        user.first_name,
        user.last_name
        FROM item
        JOIN user  
            ON item.user_id=user.id
        ORDER BY item.id DESC
        LIMIT 20`
    );
    return rows;
}
export async function deleteItem(
    itemId:number,
    userId:number
){
    const [result]=await pool.query(
        `DELETE FROM item 
        WHERE id=?
        AND user_id=?`,
        [itemId,userId]
    );
    return result as any;
}
//donation system and points
export async function createDonation(
    user_id:number,
    item_id:number,
    points:number
){
    const [result]=await pool.query(
        `INSERT INTO donation(user_id, item_id,points_awarded)
        VALUES(?,?,?)`,
        [user_id,item_id, points]
    );
    return result as any;
}

export async function addUserPoints(
    user_id:number,
    points:number
){
    const [result]=await pool.query(
        `UPDATE user
        SET points=points + ?
        WHERE id=?`,
        [points, user_id]
    );
    return result as any;
}

export async function getLeaderboard() {
    const [rows] = await pool.query(
       `SELECT
            id,
            first_name,
            last_name,
            profile_picture,
            points
        FROM user
        WHERE points > 0
        ORDER BY points DESC
        LIMIT 3`
    );
    return rows as any[];
}

export async function getDonationByItemId(item_id:number){
    const [rows] = await pool.query(
        `SELECT 
            user_id,
            points_awarded
        FROM donation
        WHERE item_id=?`,
        [item_id]
    );
    return rows as any[];
}

export async function removeUserPoints(
    user_id:number,
    points:number
){
    const [result] = await pool.query(
        `UPDATE user
        SET points =GREATEST(points - ?, 0)
        WHERE id=?`,
        [points,user_id]
    );
    return result as any;
}

//changing item status
export async function markItemSold(
    itemId:number,
    userId:number
){
const [result]=await pool.query(
    `UPDATE item
    SET status='sold'
    WHERE id=?
    AND user_id=?
    AND status='published'`,
    [itemId,userId]
);
return result as any;
}

//add reviews, display user reviews and calculating rating
export async function createReview(
    rating:number,
    comment:string,
    reviewer_id:number,
    item_id:number
){
const [result]=await pool.query(
    `INSERT INTO reviews
    (rating,
    comment,
    reviewer_id,
    item_id)
    VALUES(?,?,?,?)`,
[rating, comment,reviewer_id,item_id]
);
return result as any;
}

export async function getReviewsByUser(
userId:number
){
const [rows]=await pool.query(
    `SELECT
        reviews.rating,
        reviews.comment,
        reviews.reviewer_id,
        item.title,
        user.first_name,
        user.last_name
    FROM reviews
    JOIN item
        ON reviews.item_id = item.id
    JOIN user
        ON reviews.reviewer_id = user.id
    WHERE item.user_id = ?
    ORDER BY reviews.id DESC;`,
    [userId]
);
return rows;
}


export async function getUserRating(
userId:number
){
const [rows]=await pool.query(
    `SELECT 
        AVG(reviews.rating) AS rating
    FROM reviews
    JOIN item
    ON reviews.item_id=item.id
    WHERE item.user_id=?`,
    [userId]
);
return rows[0];
}

export async function getReviewsByItem(itemId:number){
const [rows]=await pool.query(
    `SELECT *
    FROM reviews
    WHERE item_id=?`,
    [itemId]
);
return rows;
}

export async function getItemById(id:number){
const [rows]=await pool.query(
    `SELECT *
    FROM item
    WHERE id=?`,
    [id]
);
return (rows as any[])[0];
}

//add item to wishlist, remove wishlist item, check saved items,display wishlist
export async function addToWishlist(
    user_id:number,
    item_id:number
){
    const[result]=await pool.query(
        `INSERT INTO wishlist(user_id,item_id)
        VALUES (?,?)`,
        [user_id,item_id]
    );
    return result;
}


export async function getUserWishlist(
    user_id:number
){
    const [rows]= await pool.query(
        `SELECT item.*
        FROM wishlist
        JOIN item
            ON wishlist.item_id=item.id
            WHERE wishlist.user_id=?`,
        [user_id]
    );
    return rows;
}

export async function removeFromWishlist(
    user_id:number,
    item_id:number
){
    const [result] = await pool.query(
        `DELETE FROM wishlist
         WHERE user_id=? 
         AND item_id=?`,
        [user_id,item_id]
    );
    return result as any;
}


export async function checkWishlist(
    user_id:number,
    item_id:number
){
    const [rows] = await pool.query(
        `SELECT *
         FROM wishlist
         WHERE user_id=? 
         AND item_id=?`,
        [user_id,item_id]
    );
    return (rows as any[]).length > 0;
}

export default pool;