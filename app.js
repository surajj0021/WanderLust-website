//requiring express
const express = require("express");
const app = express();

//requiring path for using view anywhere
const path=require("path");
//telling that our engine is ejs i.e we are using ejs
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//requiring the listing.js's model called Listing by using its postion
const Listing = require("./models/listing.js");

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

//basic api request for checking root is working or not  
app.get("/", (req, res) => {
    res.send("Root is Working");
});

//this is index route for website
app.get("/listings",async (req,res)=>{
    let allListings=await Listing.find({}); //get all documents from listing collection
    res.render("./listing/index.ejs",{allListings});
});







































//comment testing listing by creating a sample collection to add to database named 

// app.get("/testListing", async (req, res) => {
    
//     let sampleListing = new Listing({
//         title: "MY New Villa",
//         description: "100m away from Shreevardhan Beach",
//         price: 1000,
//         location: "Shreevardhan",
//         country: "India"
//     });
    //comment: saving sampleLisiting Document to database
    
    // await sampleListing.save()
    //     .then(res => {
    //         console.log("listing added to databases");
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    
    //     res.send("listing added to database");
// });

