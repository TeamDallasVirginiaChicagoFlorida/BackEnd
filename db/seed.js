// creating tables, seeding tables with initial values
const { 
    createUser,
    getAllCars,
    getUser,
    getUserByEmail,
    getUserById,
    createCarPost,
    getCarById,
    createCart,
    checkout, 
    getCartByBuyer,
    getOrderHistory,
    addCarToCart, 
	getCarsByCart,
	removeCartItems,
    attachCarsToCart
} = require('./index')
const {client} = require ('./client')
const dataCopy = require ('./databank')



async function createTables(){
    console.log("Starting to build tables...")
    try{
        await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) UNIQUE NOT NULL,
            photo_url VARCHAR(255),
            admin BOOLEAN DEFAULT false NOT NULL
        );`
        )
        await client.query(`
        CREATE TABLE cars(
            id SERIAL PRIMARY KEY,
            seller INTEGER REFERENCES users(id),
            type VARCHAR(255) NOT NULL,
            make VARCHAR(255) NOT NULL,
            model VARCHAR(255) NOT NULL,
            year INTEGER NOT NULL,
            color VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            transmission_type VARCHAR(255) NOT NULL,
            mileage INTEGER NOT NULL,
            interior_color VARCHAR(255) NOT NULL,
            doors INTEGER NOT NULL,
            seats INTEGER NOT NULL,
            mpg INTEGER NOT NULL,
            inventory INTEGER NOT NULL,
            photo_url VARCHAR(255) NOT NULL,
            drive_type VARCHAR(255) NOT NULL,
            new_used VARCHAR(255) NOT NULL
        );`
        )
        await client.query(`
        CREATE TABLE carts(
            id SERIAL PRIMARY KEY,
            buyer INTEGER REFERENCES users(id),
            status BOOLEAN DEFAULT TRUE
            
            );` 
            )
            
            console.log('did it make to here')
        await client.query(`
        CREATE TABLE cart_items(
            id SERIAL PRIMARY KEY,
            car INTEGER REFERENCES cars(id) UNIQUE,
            cart INTEGER REFERENCES carts(id),
            quantity INTEGER DEFAULT 1
        );`
        )
        await client.query(`
        CREATE TABLE orders(
            id SERIAL PRIMARY KEY,
            cart INTEGER REFERENCES carts(id),
            order_date VARCHAR(255) NOT NULL
        );`
        )

        console.log("finished creating tables...")
    }catch(error){
        throw error
    }
}

async function dropTables(){
    try{
        console.log("starting to drop tables..")
        await client.query(`DROP TABLE IF EXISTS orders`)
        await client.query(`DROP TABLE IF EXISTS cart_items`)
        await client.query(`DROP TABLE IF EXISTS carts`)
        await client.query(`DROP TABLE IF EXISTS cars`)
        await client.query(`DROP TABLE IF EXISTS users`)
        console.log("finished dropping tables..")
    }catch (error){
        throw error;
    }
}

async function createInitialUsers(){
    try{
        console.log("starting to create initial users")
        const leo = await createUser({email: 'leo@me.com', password: 'leocruzz', admin: true});

        const dillan = await createUser({email: 'dillan@me.com', password: 'dillanmay', admin: true});

        const lex = await createUser({email: 'lex@me.com', password: 'lexmullin', admin: true});

        const alex = await createUser({email: 'alex@me.com', password: 'alexwinston', admin: true});

        const irfan = await createUser({email: 'irfan@me.com', password: 'irfanpekusic', admin: true});

        const george = await createUser({email: 'george@me.com', password: 'curiousgeorge', admin: false});

        console.log("finished creating initial users")
    }catch(error){
        console.error("Error creating users!")
        throw error;
    }
}

async function createInitialCars() {
 try {
    console.log('Starting to create initial cars...')
    for (let i = 0; i < dataCopy.length; i++) {
    const cars = await createCarPost (dataCopy[i])
    }
    console.log('Finished creating initial cars...')
 } catch (error) {
    console.error("Error creating initial cars...")
        throw error
    }
 }
 
 async function createInitialCarts(){
    try{
        console.log('Starting to create initial carts...')
        const georgeCart= await createCart(6)
        await addCarToCart({car: 1, cart:1})
        console.log('Finished creating initial carts')
    }catch(error){
        throw error
    }
 }




async function testDb() {
    try {
        console.log("Starting database tests")

        console.log("Checking getUser function")
        const user = await getUser({email: "leo@me.com", password:"leocruzz"});
        console.log("Result: ", user)
        console.log("getUser function works")

        console.log("Checking getUserByEmail function")
        const leo = await getUserByEmail("leo@me.com")
        console.log("Result: ", leo)
        console.log("getUserByEmail function works")

        console.log("Checking getUserById function")
        const lex = await getUserById(3)
        console.log("Result: ", lex)
        console.log("getUserById function works")

        // console.log("Checking getAllCars function")
        // const allCars = await getAllCars();
        // console.log("Result: ", allCars)
        // console.log("getAllCars function works")

        console.log("Checking getCarById function")
        const car = await getCarById(1);
        console.log("Result:", car)
        console.log("getCarById function works")

        console.log("Testing getCartByBuyer function")
        const test = await getCartByBuyer(6)
        console.log("Result:", test)
        console.log('Finished testing getCartByBuyer')

        console.log('Testing getCarsByCart')
        const testingGetCarsByCart = await getCarsByCart(1)
        console.log("Result:", testingGetCarsByCart)
        console.log('Finished testing getCarsByCart')


        console.log("Testing checkout and getOrderHistory")
        const testingfunctions = await checkout(1)
        const orderHistory = await getOrderHistory(6)
        await createCart(6)
        console.log('Finished testing checkout and getOrderHistory')

        // console.log('Testing removeCartItems')
        // const testingRemoveItemsFromCart = await removeCartItems(1)
        // const theCartAfterItemRemoved = await getCarsByCart(1)
        // console.log("Result: ", testingRemoveItemsFromCart, "this is the cart", theCartAfterItemRemoved)
        // console.log('Finished testing removeCartItems')
  

        console.log("Finished with database tests")
    } catch (error) {
        console.error("An error occurred on one of the tests!")
        throw error
    }
}

async function rebuildDb() {
    try {
      await client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialCars();
      await createInitialCarts();

    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    } 
  }


rebuildDb()
.then(testDb)
.catch(console.error)
.finally(() => client.end());