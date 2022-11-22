const express = require("express");
const router = express.Router();
const { createUser, getUser, getUserByEmail, getUserById } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");

// POST /api/users/login

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both an email and a password",
    });
  } else {
    try {
      const user = await getUser({ email, password });
      if (user) {
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        // const userData = jwt.verify(token, JWT_SECRET);
        res.send({ user, message: "You're logged in!", token });
        return user;
      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Email or password is incorrect",
        });
      }
    } catch (error) {
      next(error);
    }
  }
});

// POST /api/users/register

router.post("/register", async (req, res, next) => {
    const { email, password, admin } = req.body;

    try {
        const existingUser = await getUserByEmail(email);
        if(existingUser){
            next({
                name: "UserExistsError",
                message: `An account already exists for ${email}.`,
            });
        } else if (password.length < 8) {
            next({
                name: "PasswordTooShort",
                message: "Password must be 8 characters or longer.",
            })
        } else {
            const user = await createUser({ email, password, admin });
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
            // const userData = jwt.verify(token, JWT_SECRET);
            res.send({ user, message: "Thank you for signing up! You're logged in!", token });
            return user;
        }
    } catch (error) {
        next (error)
    }
});

// GET /api/users/me
router.get("/me", requireUser, async(req, res, next)=>{
    const email=req.user.email
    try {
        const userInfo= await getUserByEmail(email)
        res.send(userInfo)
    } catch (error) {
        next (error);
    }
})

module.exports = router;
