async function getAllCars(){
	try {
		const {rows:carId}= await client.query(`
		SELECT id 
		FROM cars;
		`)
		const cars = await Promise.all(carId.map(
			car=>getCarById(car.id)
			
		));
		console.log(cars, 'get all cars')
		return cars;
	} catch (error) {
		throw error;
	}
}

async function getCarById(carId) {
    try {
      const { rows: [car] } = await client.query(`
        SELECT *
        FROM cars;
        WHERE id=$1;
      `, [carId]);
  
      if (!car) {
        throw {
          name: "CarNotFoundError",
          message: "Could not find a car with that carId"
        };
      }
  console.log(post, "GOT CAR BY ID!")
      return car;
    } catch (error) {
      throw error;
    }
  }

  async function createCarPost({
    userId,
    type,
    make,
    model,
    year,
    color,
    price,
    transmission_type,
    mileage,
    interior_color,
    doors,
    seats,
    mpg,
    inventory,
    photo_url,
    drive_type,
    new_used = []


  }) {
    try {
      const { rows: [ car ] } = await client.query(`
        INSERT INTO cars( 
            userId,
            type,
            make,
            model,
            year,
            color,
            price,
            transmission_type,
            mileage,
            interior_color,
            doors,
            seats,
            mpg,
            inventory,
            photo_url,
            drive_type,
            new_used ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *;
      `, [ userId,
        type,
        make,
        model,
        year,
        color,
        price,
        transmission_type,
        mileage,
        interior_color,
        doors,
        seats,
        mpg,
        inventory,
        photo_url,
        drive_type,
        new_used]);
  
      return car
    } catch (error) {
      throw error;
    }
  }
  

  


  module.exports ={
    getAllCars,
    getCarById,
    createCarPost,

  }