require('dotenv').config();
const { PORT = 8080 } = process.env
const express = require('express');
const cors = require('cors');
const server = express();

server.use(cors());
const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json());


server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");

    next();
})


const apiRouter = require('./api');
server.use('/api', apiRouter);

const { client } = require('./db');
client.connect();

server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
})