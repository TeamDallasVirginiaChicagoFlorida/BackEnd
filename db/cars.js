const { client } = require("./client");

async function getAllCars() {
  try {
    const { rows } = await client.query(`
		SELECT *
		FROM cars;
		`);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getCarById(carId) {
  try {
    const {
      rows: [car],
    } = await client.query(
      `
        SELECT *
        FROM cars
        WHERE id=$1;
      `,
      [carId]
    );

    if (!car) {
      throw {
        name: "CarNotFoundError",
        message: "Could not find a car with that carId",
      };
    }
    return car;
  } catch (error) {
    throw error;
  }
}

async function createCarPost({
  seller,
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
  new_used,
}) {
  try {
    const {
      rows: [car],
    } = await client.query(
      `
        INSERT INTO cars( 
            seller,
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
      `,
      [
        seller,
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
        new_used,
      ]
    );

    return car;
  } catch (error) {
    throw error;
  }
}

async function updateCarPost(carId, fields = {}) {
  console.log("this is checking to see if we made it here");
  const { descriptions } = fields;

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${(index + 1)}`)
    .join(",");
  try {
    if (setString.length > 0) {
      await client.query(
        `
          UPDATE cars
          SET ${setString}
          WHERE id=${carId}
          RETURNING *;
        `,
        Object.values(fields)
      );
    }

    if (descriptions === undefined) {
      return await getCarById(carId);
    }

    return await getCarById(carId);
  } catch (error) {
    throw error;
  }
}

async function deleteCar(id) {
  try{
  const {rows: [deleteCar]} = await client.query(`
  DELETE FROM cars
  WHERE id=${id}
  RETURNING *
  ;`)
  return deleteCar
  } catch (error) {
    throw error
  }
}


module.exports = {
  getAllCars,
  getCarById,
  createCarPost,
  updateCarPost,
  deleteCar,
};
