const express = require("express");
const router = express.Router({ mergeParams: true });
const authController = require("../controllers/authController");

const reviewController = require("../controllers/reviewController");

router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setReviewId,
    reviewController.createReview
  );
router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(reviewController.deleteReview);
module.exports = router;
