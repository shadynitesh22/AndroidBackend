const express = require("express");
const  router = express.Router();
const { protect } = require("../middleware/auth");

const {
   addCart,
   getCartItems,
   deleteCartItems
  } = require("../controllers/cart");

  router.post("/add/cart",protect , addCart);
  router.get("/cart/all",protect, getCartItems)
  router.delete("/delete/:id",protect, deleteCartItems);
  
  
  module.exports = router