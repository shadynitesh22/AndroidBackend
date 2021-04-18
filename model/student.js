const mongoose = require("mongoose");

const Student = new mongoose.Schema(
    {
        PostName:{
            type: String,
            required: [true,"Enter full name"],
            trim: true
        },
        PostLocation:{
            type: String,
            required: [true,"Enter age"],
        },
        PostStatus:{
            type: String,
            required: [true,"Select Gender"],
            trim: true
        },
        PostPrice:{
            type: Number,
            required: [true,"Enter address"],
            trim: true
        },
        photo: {
            type: String,
            default: "no-photo.jpg",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
    }
);

module.exports = mongoose.model("Student",Student);
