const express = require("express");
// get req. parameters from app.js file
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
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