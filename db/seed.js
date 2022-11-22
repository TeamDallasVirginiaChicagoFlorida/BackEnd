// creating tables, seeding tables with initial values
const { createUser } = require('./index')
const client = require ('./client')



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
async function rebuildDb() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    } 
  }


rebuildDb()
// .then(testDB)
.catch(console.error)
.finally(() => client.end());