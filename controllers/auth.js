const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../model/user");
const crypto = require("crypto");

//--------------------------REGISTER USER-----------------

exports.register = asyncHandler(async (req, res, next) => {
  const { username,email,phone,password,status} = req.body;
  const user = await User.create({
   username,
   email,
   phone,
   password,
   status,
  });

  sendTokenResponse(user, 200, res);
});

//-------------------LOGIN-------------------

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password ,status } = req.body;

  if (!username || !password || !status) {
    return next(new ErrorResponse("Please provide username and password and status"), 400);
  }

  // Check user
  const user = await User.findOne({ username: username }).select("+password");
  //because in password field we have set the property select:false , but here we need as password so we added + sign

  if (!user) {
    res
    .status(201)
    .json({
      success: false,
      message: 'Invalid credentails user',
    });  
  }

  // const isMatch = await user.matchPassword(password); // decrypt password
  
  if (user.password!= password) {
    res
    .status(201)
    .json({
      success: false,
      message: 'Invalid credentails',
    });

  }
  if(!status){
    res
    .status(201)
    .json({
      success:false,
      message:'Invalid status',
    }
  
    );
  }
    
 else{
  sendTokenResponse(user, 200, res);
}
});

//------------------LOGOUT--------------
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: "User Logged out",
  });
});

//-------------------------CURRENT USER DETAILS-----------

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
 
  const token = user.getSignedJwtToken();

  const options = {
    //Cookie will expire in 30 days
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Cookie security is false .if you want https then use this code. do not use in development time
  if (process.env.NODE_ENV === "proc") {
    options.secure = true;
  }

  //we have created a cookie with a token
  res
    .status(statusCode)
    .cookie("token", token, options) // key , value ,options
    .json({
      success: true,
      token,
    });

};
////////-----Update----///////////////////////////////////////////
exports.updateUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id
  // const user = await User.findById(req.params.id);
  const { username,email,phone } = req.body;

  // if (!user) {
  //   return next(new ErrorResponse("User not found"), 404);
  // }

  User.findByIdAndUpdate(req.params.id, { username,email,phone },{new:true},
    function (err, docs) {
      if (err) {
        res.status(200).json({
          success: false,
          error:err.message,
        });
      }
      else {
        res.status(200).json({
          success: true,
          data: docs,
        });
      }
    }
  )

  //   let newuser = await user.updateOne({_id : id}, {firstName:firstName,lastName:lastName,email:email,address:address,phone:phone})
  // ;
  //   res.status(200).json({
  //     success: true,
  //     data: newuser,
  //   });

});

exports.UserPhotoUpload = asyncHandler(async (req, res, next) => {
  console.log('user photo upload', req.params.id)
  const user = await User.findById(req.params.id);

  console.log(user);
  if (!user) {
    return next(new ErrorResponse(`No user found with ${req.params.id}`), 404);
  }


  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo and accept any extension of an image
  // if (!file.mimetype.startsWith("image")) {
  //   return next(new ErrorResponse(`Please upload an image`, 400));
  // }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  file.name = `photo_${user.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.err(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    //insert the filename into database
    await User.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
  });

  res.status(200).json({
    success: true,
    data: file.name,
  });
});


