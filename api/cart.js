const express = require("express");
const { getUserByEmail } = require("../db");
const { requireUser } = require("./utils");
const router = express.Router();
const {getUserByEmail} = require('../db');
const { getCartByBuyer } = require("../db/cart");

// GET  /api/carts

router.get("/", requireUser, async(req, res, next)=>{
     const userData = await getUserByEmail(req.user.email)
     const userId= userData.id;
    try {
        const usersCart= await getCartByBuyer(2)
        res.send(usersCart)
        console.log(usersCart, 'is this working')
    } catch (error) {
        throw error
    }
})

