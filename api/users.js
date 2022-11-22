const express = require('express');
const router = express.Router();
const {
    createUser,
    getUser,
    getUserByEmail,
    getUserById,
} = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require('./utils')

// POST /api/users/login

router.post("/login", async(req, res, next)=>{
    const{email, password} = req.body;

    if(!email || !password){
        next({
            name: "MissingCredentialsError",
            message: "Please supply both an email and a password"
        });
    }else{
        try {
            const user = await getUser({email, password});
            if(user){
                const token = jwt.sign(
                    {id: user.id, email: user.email},
                    JWT_SECRET
                );
                const userData=jwt.verify(token, JWT_SECRET);
                res.send({user, message: "You're logged in!", token})
                return user
            }else{
                next({
                    name: "IncorrectCredentialsError",
                    message: "Email or password is incorrect"
                })
            }
        } catch (error) {
            next(error)
        }
    }

})


// POST /api/users/register

router.post("/register")


// GET /api/users/me



module.exports=
    router
