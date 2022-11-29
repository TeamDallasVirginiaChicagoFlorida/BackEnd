const express = require("express")
const router = express.Router();
const { requireUser } = require('./utils')
const { getCarsByCart, removeCartItems, addCarToCart } = require('../db/cart_items');

// router.patch("/",
// requireUser,
// async (req, res, next) => {
//   try {
// 	const cartItems = req.params.cartItems;

// 	const originalCartItems = await getCartById(
// 	  cartItems
// 	);

// 	const cart = await getCartById(originalCartItems.cartId);
// 	const fields = req.body;

// 	if (originalCartItems) {
// 	  if (cart.Id === req.user.id) {
// 		const updatedCartItems = await updateCartItems({
// 		  id: cartItems,
// 		  ...fields,
// 		});

// 		res.send(updatedCartItems);
// 	  } else {
// 		res.statusCode = 403;
// 		next({
// 		  error: "403Error",
// 		  name: "UnauthorizedUserError",
// 		  message: `User ${req.user.id} is not allowed to update ${cartItems}`,
// 		});
// 	  }
// 	} else {
// 	  next({
// 		error: "noCartItem",
// 		name: "Does not exist",
// 		message: `${cartItems} does not exist`,
// 	  });
// 	}
//   } catch ({ error, name, message }) {
// 	next({ error, name, message });
//   }
// }
// );

router.delete("/:id",
requireUser,
async (req, res) => {
	const {id} = req.params
  try {
	// const cartItems = await getCarsByCart(id)

	// if (req.user.id == cartItems.buyerId ){
		const cartItemDeleted = await removeCartItems(id)
		res.send(cartItemDeleted)
	// }else {
	// 	res.statusCode = 403
	// 	res.send({
	// 		message: `User ${req.user.id} is not allowed to delete ${cartItems.buyerId}`,
	// 		name: "Unauthorized to Delete",
	// 		error: "Unauthorized user can't delete."
	// 	})
	// }
	}


   catch (error) {
	throw error
}
});

router.post("/", requireUser, async (req, res, next)=>{
	const {car, cart}= req.body
	try {
		const addedCar = await addCarToCart({car, cart})
		res.send(addedCar)
	} catch (error) {
		throw error
	}
})


module.exports = router