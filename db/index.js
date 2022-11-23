







module.exports = {
    ...require('./client'), // adds key/values from users.js
    ...require('./users'), // adds key/values from users.js
    ...require('./cars'), // adds key/values from cars.js
    ...require('./cart'), //adds values from cart.js
    ...require('./cart_items'), //adds values from cart_items.js
  }