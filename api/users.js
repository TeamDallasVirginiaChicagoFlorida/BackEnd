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

// POST /api/users/register

// GET /api/users/me