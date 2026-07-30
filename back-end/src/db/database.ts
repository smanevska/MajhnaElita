import mysql from "mysql2/promise";

const pool=mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});

export async function authUser(email:string){
    const [rows] = await pool.query(
       `SELECT *
        FROM user
        WHERE email = ? `,
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
        (
            first_name,
            last_name,
            email,
            password
        )
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
            phone,
            location,
            profile_picture
        FROM user
        WHERE id = ? `,
        [id]
    );
    return rows as any[];
}
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
export default pool;