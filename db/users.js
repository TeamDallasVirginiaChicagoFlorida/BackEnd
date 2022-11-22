const client = require("./client")

async function createUser({email, password}){

    try{
        const{
            rows: [user]}= await client.query(
                `INSERT INTO users(email, password, admin)
                VALUES ($1, $2, $3)
                ON CONFLICT (email) DO NOTHING
                RETURNING*;
            `,[email, password, admin]
            );
                return user;
    }catch(error){
        throw error;
    }
}

async function getUserByEmail(userEmail){
    try{
        const {
            rows:[user]}= await client.query(
                `SELECT email, id, password FROM users,
                WHERE  email=$1;
                `, [userEmail]
            ); 
            if(!user){
                return null;
            }
            return user;
    }catch(error){
        throw error;
    }
}

async function getUserById(userId){
    try{
        const{
            rows:[user]}=await client.query(
                `SELECT id, username FROM users,
                WHERE id= $1;
                `,[userId]
            )
            if(!user){
                return null
            }return user;
    }catch(error){
        throw error
    }
}

