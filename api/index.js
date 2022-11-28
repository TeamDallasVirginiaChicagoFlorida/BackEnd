const express = require('express');
const router = express.Router();
const { getUserById } = require('../db/users')
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

//Cheking if there is an authorized user and setting req.user if there is, this will be called back on if an authorized user is required for a particular route. 
router.use(async (req, res, next) => {
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');

    if (!auth) {
        next();
    } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);

        try {
            const { id } = jwt.verify(token, JWT_SECRET);

            if(id) {
                req.user = await getUserById(id);
                next();
            }
        } catch ({ name, message}) {
            next({name, message})
        }
    } else {
        next ({
            name: "AuthorizationHeaderError",
            message: `Authorization token must start with ${prefix}`
        });
    }
});

router.use((req, res, next) => {
    if (req.user) {
        console.log("User is set:", req.user);
    }
    
    next();
})

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/cars
const carsRouter = require('./cars');
router.use('/cars', carsRouter);

// ROUTER: /api/cart
const cartRouter = require('./cart');
router.use('/cart', cartRouter);

// // ROUTER: /api/cart_items
// const cart_items = require('./cart_items');
// router.use('/cart_items', cart_items);


// ROUTER: 404 Error
router.get('/unknown', async (req, res, next) => {
    res.status(404);
    res.send({
        message:'error'
    })
})



module.exports = router;