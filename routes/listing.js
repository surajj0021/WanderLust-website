const express = require("express");
const router = express.Router(); //requiring router Object

const wrapAsync = require("../utils/wrapAsync.js"); //from utils 
const { listingSchema} = require("../schema.js");
const ExpressError = require("../utils/expressError.js"); //from utils

//requiring the listing.js's model called Listing by using its postion
const Listing = require("../models/listing.js");

//created function for Schema Validation for listings
const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);//checking if the imcoming data is valid or not 
    if (result.error) {
        throw new ExpressError(400, result.error.details[0].message);
    } else {
        next();
    }
}






//routes below


//basic api request for checking root is working or not  
// router.get("/", (req, res) => {
//     res.send("Root is Working");
// });

//Index route for website
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({}); //get all documents from listing collection
    res.render("./listing/index.ejs", { allListings });
}));

//NEW ROUTE creating new listing 
router.get("/new", (req, res) => {
    res.render("listing/new.ejs");
});

//create Route
//accepting Post req for creating new lisiting
router.post("/", validateListing, wrapAsync(async (req, res) => {
    let data = req.body.listing;
    //Handling Empty image problem
    if (!data.image || !data.image.url) {
        data.image = {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
            filename: "default"
        };
    }
    if (!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data for Listings");
    }
    const newListing = new Listing(data);
    await newListing.save();
    res.redirect("/listings");
}));

//show route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
}));

//edit route 
router.get("/:id/edit", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listing/edit.ejs", { listing });
}));

//update route
router.put("/:id", wrapAsync(async (req, res) => {
    if (!req.body.listings) {
        throw new ExpressError(400, "Send Valid Data for Listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}));



module.exports = router;