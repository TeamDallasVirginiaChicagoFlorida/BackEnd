const express = require("express");
const { getAllCars, getCarById, createCarPost, updateCarPost, deleteCar } = require("../db/cars");
const router = express.Router();
const { requireUser } = require("./utils");

router.get("/", async (req, res, next) => {
  const postData = {};
  try {
    const allCars = await getAllCars(postData);
    res.send(allCars);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const singleCar = await getCarById(id);
    res.send(singleCar);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireUser, async (req, res, next) => {
  console.log("req dot body", req.body);
  const {
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
  } = req.body;
  const postData = {};

  try {
    postData.seller = req.user.id;
    postData.type = type;
    postData.make = make;
    postData.model = model;
    postData.year = year;
    postData.color = color;
    postData.price = price;
    postData.transmission_type = transmission_type;
    postData.mileage = mileage;
    postData.interior_color = interior_color;
    postData.doors = doors;
    postData.seats = seats;
    postData.mpg = mpg;
    postData.inventory = inventory;
    postData.photo_url = photo_url;
    postData.drive_type = drive_type;
    postData.new_used = new_used;
    const post = await createCarPost(postData);

    if (post) {
      res.send({ post });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.use((req, res, next) => {
  console.log("request is being made to /cars");
  next();
});

router.delete("/:carId", requireUser, async (req, res, next) => {
  try {
    const post = await getCarById(req.params.carId);

    if (post && post.seller === req.user.id) {
      const deletedCar = await deleteCar(req.params.carId);

      res.send(deletedCar);
    } else {
      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      next(
        post
          ? {
              name: "UnauthorizedUserError",
              message: "You cannot delete a car which is not yours",
            }
          : {
              name: "PostNotFoundError",
              message: "That car is unavailable",
            }
      );
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.patch("/:carId", requireUser, async (req, res, next) => {
  const { carId } = req.params;
  const {
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
    new_used = "",
  } = req.body;

  const updateFields = {};

  //   if ( && tags.length > 0) {
  // 	updateFields.tags = tags.trim().split(/\s+/);
  //   }
  if (type) {
    updateFields.type = type;
  }

  if (make) {
    updateFields.make = make;
  }

  if (model) {
    updateFields.model = model;
  }

  if (year) {
    updateFields.year = year;
  }
  if (color) {
    updateFields.color = color;
  }
  if (price) {
    updateFields.price = price;
  }
  if (transmission_type) {
    updateFields.transmission_type = transmission_type;
  }
  if (mileage) {
    updateFields.mileage = mileage;
  }
  if (interior_color) {
    updateFields.interior_color = interior_color;
  }
  if (doors) {
    updateFields.doors = doors;
  }
  if (seats) {
    updateFields.seats = seats;
  }
  if (mpg) {
    updateFields.mpg = mpg;
  }
  if (inventory) {
    updateFields.inventory = inventory;
  }
  if (photo_url) {
    updateFields.photo_url = photo_url;
  }
  if (drive_type) {
    updateFields.drive_type = drive_type;
  }
  if (new_used) {
    updateFields.new_used = new_used;
  }

  try {
    const originalCarPost = await getCarById(carId);

    if (originalCarPost.seller === req.user.id) {
      const updatedCarPost = await updateCarPost(carId, updateFields);
      res.send({ post: updatedCarPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a car that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
