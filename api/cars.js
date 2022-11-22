const express = require("express");
const { getAllCars } = require("../db");
const router = express.Router();

carsRouter.get("/", async (req, res, next)=>{
	const postData = {};
	try {
		const allCars = await getAllCars(postData);
		res.send(allCars);
		} catch (error) {
		next(error);
}});

module.exports = router;

carsRouter.post("/",requireUser,
requireActiveUser,
async (req, res, next) => {
  console.log("req dot body", req.body);
  const {seller,
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
    new_used = '' } = req.body;

  const tagArr = tags.trim().split(/\s+/);
  const postData = {};

  try {
	postData.seller = req.user.id
	postData.type = type
	postData.make = make
	postData.model = model
	postData.year = year
	postData.color = color
	postData.price= price
	postData.transmission_type = transmission_type
	postData.mileage =mileage
	postData.interior_color = interior_color
	postData.doors = doors
	postData.seats = seats
	postData.mpg = mpg
	postData.inventory = inventory
	postData.photo_url = photo_url
	postData.drive_type = drive_type
	postData.new_used = new_used
	const post = await createCarPost(postData);

	if (post) {
	  res.send({ post });
	}
  } catch ({ name, message }) {
	next({ name, message });
  }
}
);
