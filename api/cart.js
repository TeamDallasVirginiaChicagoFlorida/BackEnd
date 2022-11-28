const express = require("express");
const { getUserByEmail, getUser } = require("../db/users");
const { requireUser } = require("./utils");
const router = express.Router();
const { getCartByBuyer, checkout,  getOrderHistory } = require("../db/cart");

// GET  /api/carts

router.get("/", requireUser, async(req, res, next)=>{
     const userData = await getUserByEmail(req.user.email)
     const userId= userData.id;
    try {
        const usersCart= await getCartByBuyer(userId)
        res.send(usersCart)
    } catch (error) {
        throw error
    }
})

router.patch("/:id", async(req, res, next)=>{
    const {id} = req.params;
    try {
        const userCheckout = await checkout(id);
        res.send(userCheckout);
    } catch (error) {
        throw error;
    }
})

router.get("/:orderhistory", requireUser, async(req, res, next)=>{
    const userData = await getUserByEmail(req.user.email)
    const buyer = userData.id;
   try {
       const history = await getOrderHistory(buyer)
       res.send(history)
   } catch (error) {
        throw error;
   }
})

module.exports = router;