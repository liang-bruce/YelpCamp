const express = require("express");
// get req. parameters from app.js file
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    // @ts-ignore
    review.author = req.user._id;
    if (campground !== null) {
      // @ts-ignore
      campground.reviews.push(review);
      await review.save();
      await campground.save();
      req.flash("success", "Created new review!");
      res.redirect(`/campgrounds/${campground._id}`);
    }
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // delete from campground mongoose model
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // delete from review mongoose model
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
