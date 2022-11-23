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
		console.log(cars, 'this is cars')
		return cars
	} catch (error) {
		throw error
	}
}

async function removeCartItems(cartId, fields = {}){
	const { tags } = fields;
    delete fields.tags;

    const setString = Object.keys(fields).map(
      (key, index) =>`"${key }"=$${ index = 1 }`
    ).join(',');
    try {
    
      if (setString.length > 0) {
        await client.query(`
          UPDATE cart
          SET ${ setString }
          WHERE id=${ cartId }
          RETURNING *;
        `, Object.values(fields));
      }
  
      
      if (tags === undefined) {
        return await getCarsByCart(cartId);
      }
	  return await getCarsByCart(cartId);
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
