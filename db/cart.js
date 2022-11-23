const { client } = require("./client");

//creates an empty cart to be done by default when a user is created, or after checkout to create a new empty cart
async function createCart( buyer ) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
            INSERT INTO carts (buyer, status)
            VALUES ($1, true)
            RETURNING *;
            `,
      [buyer]
    );
    console.log(cart, 'this is the cart part1')
    return cart;
  } catch (error) {
    throw error;
  }
}

//changes cart status to false upon checking out
async function checkout(id) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
            UPDATE carts
            SET status=false
            WHERE id=$1
            RETURNING *;
            `,
      [id]
    );
    return cart;
  } catch (error) {
    throw error;
  }
}

//return the active cart for the user so we can display it on the shopping cart page
async function getCartByBuyer(buyer) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
                SELECT *
                FROM carts
                WHERE buyer=$1 AND status=true;
                `,
      [buyer]
    );
    return cart;
  } catch (error) {
    throw error;
  }
}

//return all past carts that have already been checked out to show on the order history component
async function getOrderHistory(buyer) {
  try {
    console.log( 'is car being returned')
    const {
      rows: [cart],
    } = await client.query(
      `
                SELECT *
                FROM carts
                WHERE buyer=$1 AND status=false;
                `,
      [buyer]
    );
      return cart;

  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCart,
  checkout,
  getCartByBuyer,
  getOrderHistory,
};
