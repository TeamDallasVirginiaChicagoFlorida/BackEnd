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
		const { rows: [cartCar], } = await client.query(`
		INSERT INTO cart_items(car, cart)
		VALUES ($1, $2)
		ON CONFLICT (car) DO NOTHING
		RETURNING *;
		`, [car, cart]);
		const{ rows: [vehicle], }= await client.query(`
		UPDATE cars
		SET inventory=0
		WHERE id=$1
		RETURNING *;
		`, [car])
		return cartCar
	} catch (error) {
		throw error;
	}
}

async function attachCarsToCart(carts){
    const cartsToReturn = [...carts];
    const binds = carts.map((_, index)=>`$${index + 1}`)
	console.log(binds,"this is binds");
    //to create bindings $1, $2, $3 etc. for however many carts there are
    const cartIds = carts.map((cart) => {return cart.id;});
    if (!cartIds || cartIds.length===0) {return[]}
    //if there are no carts return an empty array
    try {
        //get the cars, JOIN with cart_items (so we can get a cartID), and only those that have the cartID on the cart_items table join
        const {rows: cars } = await client.query(
            `
            SELECT cars.*, cart_items.car, cart_items.cart, cart_items.quantity
            FROM cars
            JOIN cart_items ON cart_items.car = cars.id
            WHERE cart_items.cart IN (${binds});
            `, cartIds
        );
		console.log(cars, "this is carszzzz")
        //loop over the carts
        for (const cart of cartsToReturn) {
            // filter the cars to only include those that have this cartId
            const carsToAdd = cars.filter(
                (car) => car.cart === cart.id
            );
            //attach the car to each cart (creating a new key value pair)
            cart.cars = carsToAdd;
        }
        return cartsToReturn;
    } catch (error) {
        console.log(error)
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
		const{ rows: [vehicle], }= await client.query(`
		UPDATE cars
		SET inventory=1
		WHERE id=${cart_items.car}
		RETURNING *;
		`)
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
	attachCarsToCart
  }
