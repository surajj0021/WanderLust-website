//requiring express
const express = require("express");
const app = express();
const wrapAsync = require("./utils/wrapAsync.js"); //from utils 
const ExpressError = require("./utils/expressError.js"); //from utils
const { listingSchema, reviewSchema } = require("./schema.js");

const ejsMate = require("ejs-mate");
//middleware for reading client data 
app.use(express.urlencoded({ extended: true }));
//for reading client i.e http data which is like name:raju&age=20 and convert it to name:"raju" ,age: 20

//here we are using methodOverride becuse form cant send PUT method instead it send POST so to over ride it PUT is send in query string using method override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//requiring path for using view anywhere
const path = require("path");
//telling that our engine is ejs i.e we are using ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//requiring the listing.js's model called Listing by using its postion
const Listing = require("./models/listing.js");

//requring reviews Model
const Review = require("./models/review.js");

//requiring mongoose
const mongoose = require("mongoose");
//node connection to database
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
    .then(res => {
        console.log("Database connection succesfull");
    })
    .catch(err => {
        console.log(err);
    });

//server starting or listening for commands from client
app.listen(8080, () => {
    console.log("server is started");
});

//ejs mate setup
app.engine("ejs", ejsMate); //use ejsmate as engine instead of ejs
app.set("view enjine", "ejs"); //Use EJS as the template engine to render views

//for using public folder from anywhere
app.use(express.static(path.join(__dirname, "public")));

//created function for Schema Validation for listings
const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);//checking if the imcoming data is valid or not 
    if (result.error) {
        throw new ExpressError(400, result.error.details[0].message);
    } else {
        next();
    }
}
//created function for Schema Validation for Reviews
const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);//checking if the imcoming data is valid or not 
    if (result.error) {
        throw new ExpressError(400, result.error.details[0].message);
    } else {
        next();
    }
}

//routes below


//basic api request for checking root is working or not  
app.get("/", (req, res) => {
    res.send("Root is Working");
});

//this is index route for website
app.get("/listings", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({}); //get all documents from listing collection
    res.render("./listing/index.ejs", { allListings });
}));

//creating new listing 
app.get("/listings/new", (req, res) => {
    res.render("listing/new.ejs");
});

//create Route
//accepting Post req for creating new lisiting
app.post("/listings", validateListing, wrapAsync(async (req, res) => {
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
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
}));

//edit route 
app.get("/listings/:id/edit", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listing/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if (!req.body.listings) {
        throw new ExpressError(400, "Send Valid Data for Listings");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
}));


//Reviews Route(POST route)
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id); //extracting listing by id 
    let newReview = new Review(req.body.review);//creating new review from form submission from show page

    listing.reviews.push(newReview.id); //pushing review to reviews array of listing
    await newReview.save();
    await listing.save();
    console.log("New Review Saved");
    res.redirect(`/listings/${listing.id}`);
}));

//Reviews Delete Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));



//for all other incoming request rather than this route
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


//defining middleware for Error handling
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.render("error.ejs", { err });
    // res.status(status).send(message);
});





























