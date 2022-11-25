const {client}= require("./client");

// async function getCartByBuyer(id) {
// 	try {
// 		const {rows: [cart], } = await client.query(`
// 		SELECT *
// 		FROM cart
// 		WHERE id=$1
// 		`, [id]);
// 		return cart;
// 	} catch (error) {
// 		throw error
		
// 	}
// }

async function addCarToCart({car, cart}){
	try {
		const { rows: [cartcar], } = await client.query(`
		INSERT INTO cart_items(car, cart)
		VALUES ($1, $2)
		ON CONFLICT (car) DO NOTHING
		RETURNING *;
		`, [car, cart]);
		return cartcar
	} catch (error) {
		throw error;
	}
}

async function getCarsByCart(id){
	try {
		const {rows: cars } = await client.query(`
		SELECT *
		FROM cart_items
		WHERE cart=$1;
		`, [id])
		return cars
	} catch (error) {
		throw error
	}
}

async function removeCartItems(id){
	try{
		const {
			rows: [car],
		} = await client.query(
			`
			DELETE FROM cart_items WHERE id=$1
			RETURNING *;
			`, [id]
		)
		return car;
    } catch (error) {
      throw error;
    }
  }

  //Need a function that gets all of the cars that are in a specific cart so that we can then look at those in the getCartByUser function

  module.exports = {
	// getCartByBuyer,
	addCarToCart,
	getCarsByCart,
	removeCartItems,
  }
