const Joi = require("joi");
const { model } = require("mongoose");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),

    description: Joi.string().required(),

    price: Joi.number().required().min(0),

    location: Joi.string().required(),

    country: Joi.string().required(),

    image: Joi.object({
      url: Joi.string().uri().allow("", null),
      filename: Joi.string().allow("", null)
    }).default({})
  }).required()
});


//writing Server Side Validation Schema for Reviews
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required()
})