const User = require("./../models/userModel");
const multer = require('multer')
const sharp = require('sharp')
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const factory = require("../controllers/factoryHandler");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null , 'public/img/users')
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1]
//     cb(null , `user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })

const multerStorage =  multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null , true)
  } else {
    cb(new AppError('Please upload images not regular files' , 400),false)
  }
}


const upload = multer({
  storage: multerStorage,
  fileFilter:multerFilter
})

exports.uploadUserPhoto = upload.single('photo')

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if(!req.file) return next()
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`)

  next()
})

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((item) => {
    if (allowedFields.includes(item)) newObj[item] = obj[item];
  });

  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user posts password related data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("This route is not for password modifictation", 400)
    );
  }

  // Filter unwanted fields
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename

  // 2) Update user docs
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "Success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "Success",
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "InternalService",
    message: "Error Happend",
  });
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getOneUser = factory.getOne(User);

exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
