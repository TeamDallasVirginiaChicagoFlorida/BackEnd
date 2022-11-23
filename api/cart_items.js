const express = require("express")
const router = express.Router();
const { requireUser } = require('./utils')
const { addCarToCart, getCarsByCart, getCartByBuyer, removeCartItems, createCart } = require('../db');

router.patch("/.db/cart_items",
requireUser,
async (req, res, next) => {
  try {
	const cartItems = req.params.cartItems;

	const originalCartItems = await getCartById(
	  cartItems
	);

	const cart = await getCartById(originalCartItems.cartId);
	const fields = req.body;

	if (originalCartItems) {
	  if (cart.Id === req.user.id) {
		const updatedCartItems = await updateCartItems({
		  id: cartItems,
		  ...fields,
		});

		res.send(updatedCartItems);
	  } else {
		res.statusCode = 403;
		next({
		  error: "403Error",
		  name: "UnauthorizedUserError",
		  message: `User ${req.user.username} is not allowed to update ${cartItems}`,
		});
	  }
	} else {
	  next({
		error: "noCartItem",
		name: "Does not exist",
		message: `${cartItems} does not exist`,
	  });
	}
  } catch ({ error, name, message }) {
	next({ error, name, message });
  }
}
);

router.delete("./db/cart_items",
requireUser,
async (req, res, next) => {
  try {
	const cartItems = req.params.cartItems;

	const cart = await getRoutineActivityById(routineActivityId);

	const routine = await getRoutineById(routineActivity.routineId);

	if (routineActivity) {
	  if (routineActivityId && routine.creatorId === req.user.id) {
		const destroyedRoutineActivity = await destroyRoutineActivity(
		  routineActivityId
		);

		res.send(destroyedRoutineActivity);
	  } else {
		res.statusCode = 403;
		next({
		  error: "deleteError",
		  name: "not authorized user",
		  message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
		});
	  }
	} else {
	  next({
		error: "noRoutineError",
		name: "Does not exist",
		message: `${routineActivityId} does not exist`,
	  });
	}
  } catch ({ error, name, message }) {
	next({ error, name, message });
  }
}
);