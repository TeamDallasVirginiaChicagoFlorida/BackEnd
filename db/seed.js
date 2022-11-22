// creating tables, seeding tables with initial values
const {client 

} = require('./index')



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
async function rebuildDb() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
    } catch (error) {
      console.log("Error during rebuildDB")
      throw error;
    } 
  }


rebuildDb()
// .then(testDB)
.catch(console.error)
.finally(() => client.end());