//requiring express
const express = require("express");
const app = express();
const ExpressError = require("./utils/expressError.js"); //from utils

const listings=require("./routes/listing.js"); //using routes instead of bulking code in seperate folder
const reviews=require("./routes/review.js"); 

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


///listing Routes Replacement
app.use("/listings",listings);

//Review Route in review.js in routes folder
app.use("/listings/:id/reviews",reviews);

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





























