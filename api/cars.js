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

carsRouter.use((req, res, next) => {
	console.log("request is being made to /cars");
	next();
})

carsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const post = await getCarById(req.params.carId);
  
      if (post && post.seller === req.user.id) {
        const updatedPost = await updateCarPost(car.id, { active: false });
  
        res.send({ post: updatedCarPost });
      } else {
        // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a car which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That car is unavailable"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });

module.exports = router;