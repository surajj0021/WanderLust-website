const mongoose = require("mongoose");
const Schema = mongoose.Schema; //for avoiding repitative writing 

//creating listing schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
            default: "default"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
        }
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});




//here when delete operation is done on listing so post(after)that this middleware will execute
//and delte the reviews that are in this listings
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});


//creating model from listing Schema
const Listing = mongoose.model("Listing", listingSchema);

//exporting to app.js
module.exports = Listing;

