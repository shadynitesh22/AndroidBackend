const mongoose = require('mongoose');
const date = new Date().toLocaleDateString("en-US").split("/").toString()
const Cart = mongoose.model('Cart', {

    itemName : {
        type : String,
        required : [true,'Enter food name']
    },
    itemPrice: {
        type: String,
        required : [true,'Enter food price']
        },
    photo: {
        type: String,
        default: "no-photo.jpg",
      },
    qantity: {
        type: Number,
        default: 1,
      },

});

module.exports = Cart