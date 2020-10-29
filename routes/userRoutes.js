const express = require("express");
const userController = require("../controllers/userControllers");
const authController = require("../controllers/authController");
const router = express.Router();


router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/forgetpassword", authController.forgetPassword);
router.patch("/resetpassword/:token", authController.resetPassword);

router.use(authController.protect);
router.patch("/updatepassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getOneUser);
router.patch("/updateme", userController.uploadUserPhoto,userController.resizeUserPhoto, userController.updateMe);
router.delete("/deleteme", userController.deleteMe);

router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
