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