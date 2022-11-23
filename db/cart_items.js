const {client}= require("./client");

async function getCartByBuyer(id) {
	try {
		const {rows: [cart], } = await client.query(`
		SELECT *
		FROM cart
		WHERE id=$1
		`, [id]);
		return cart;
	} catch (error) {
		throw error
		
	}
}

async function addCarToCart({make, model, color, price}){
	try {
		const { rows: [car], } = await client.query(`
		INSERT INTO cart_items(make, model, color, price)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (make, model, color, price)
		RETURNING *;
		`, [make, model, color, price]);
		return car
	} catch (error) {
		throw error;
		
	}
}

async function getCarsByCart({id}){
	try {
		const {rows: cars } = await client.query(`
		SELECT *
		FROM cars
		WHERE "carId"=$1;
		`, [id]);
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

  module.export = {
	getCartByBuyer,
	addCarToCart,
	getCarsByCart,
	removeCartItems,
  }
