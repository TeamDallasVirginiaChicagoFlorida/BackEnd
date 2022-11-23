// creating tables, seeding tables with initial values
const { 
    createUser,
    getAllCars,
    getUser,
    getUserByEmail,
    getUserById,
    createCarPost,
    getCarById,
    
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
            admin BOOLEAN DEFAULT false
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
            status BOOLEAN DEFAULT TRUE,
            
        );` 
        )

        await client.query(`
        CREATE TABLE cart_items(
            id SERIAL PRIMARY KEY,
            car INTEGER REFERENCES cars(id),
            cart INTEGER REFERENCES carts(id),
            quantity INTEGER DEFAULT 1
        );`
        )
        await client.query(`
        CREATE TABLE orders(
            id SERIAL PRIMARY KEY,
            cart INTEGER REFERENCES carts(id),
            order_date VARCHAR(255) NOT NULL
        )`)

        console.log("finished creating tables...")
    }catch(error){
        throw error
    }
}

async function dropTables(){
    try{
        console.log("starting to drop tables..")
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

    // const car1 = await createCarPost({seller: 1,
    //     type: 'Sedan' ,
    //     make: 'Toyota',
    //     model: 'Corolla',
    //     year: 2018,
    //     color: "black",
    //     price: 15000.00,
    //     transmission_type: "automatic",
    //     mileage: 50000,
    //     interior_color: "gray",
    //     doors: 4,
    //     seats: 5,
    //     mpg: 20,
    //     inventory: 1,
    //     photo_url: '',
    //     drive_type: "2WD",
    //     new_used: "used" })
    console.log('Finished creating initial cars...')
 } catch (error) {
    console.error("Error creating initial cars...")
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

        console.log("Checking getAllCars function")
        const allCars = await getAllCars();
        console.log("Result: ", allCars)
        console.log("getAllCars function works")

        console.log("Checking getCarById function")
        const car = await getCarById(1);
        console.log("Result:", car)
        console.log("getCarById function works")
        
        console.log("Finished with database tests")
    } catch (error) {
        console.error("An error occured on one of the tests!")
        throw error
    }
}

async function rebuildDb() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialCars();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    } 
  }


rebuildDb()
.then(testDb)
.catch(console.error)
.finally(() => client.end());