const express = require("express");
const router = express.Router();

const { register, login, getMe, logout,UserPhotoUpload,updateUser } = require("../controllers/auth");

const { protect } = require("../middleware/auth");

router.post("/registeruser", register);
router.post("/loginuser", login);
router.get("/me", protect, getMe);
router.put("/user/:id/photo", UserPhotoUpload);
// router.post("/forgotpassword", forgotPassword);
// router.put("/resetpassword/:resettoken", resetPassword);
router.get("/logout", logout);
router.put("/update/user/:id", updateUser);

module.exports = router;
