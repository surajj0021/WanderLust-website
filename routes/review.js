const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js"); //from utils 
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js"); //from utils

//requring reviews Model
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


//created function for Schema Validation for Reviews
const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);//checking if the imcoming data is valid or not 
    if (result.error) {
        throw new ExpressError(400, result.error.details[0].message);
    } else {
        next();
    }
}

//Reviews Route(POST route)
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id); //extracting listing by id 
    let newReview = new Review(req.body.review);//creating new review from form submission from show page

    listing.reviews.push(newReview.id); //pushing review to reviews array of listing
    await newReview.save();
    await listing.save();
    console.log("New Review Saved");
    res.redirect(`/listings/${listing.id}`);
}));

//Reviews Delete Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;