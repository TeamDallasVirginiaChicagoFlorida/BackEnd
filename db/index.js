const { Client } = require('pg')

const client = new Client(process.env.DATABASE_URL ||'postgres://localhost:5432/GraceShopper');







module.exports = {
    // ...require('./client'), // adds key/values from users.js
    ...require('./users'), // adds key/values from users.js
    ...require('./cars'), // adds key/values from cars.js
    client

  }