//requiring express
const express = require("express");
const app = express();
const ejsMate=require("ejs-mate");
//middleware for reading client data 
app.use(express.urlencoded({ extended: true }));
//for reading client i.e http data which is like name:raju&age=20 and convert it to name:"raju" ,age: 20

//here we are using methodOverride becuse form cant send PUT method instead it send POST so to over ride it PUT is send in query string using method override
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

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

//ejs mate setup
app.engine("ejs",ejsMate); //use ejsmate as engine instead of ejs
app.set("view enjine","ejs"); //Use EJS as the template engine to render views

//for using public folder from anywhere
app.use(express.static(path.join(__dirname,"public")));




//routes below



//basic api request for checking root is working or not  
app.get("/", (req, res) => {
    res.send("Root is Working");
});

//this is index route for website
app.get("/listings",async (req,res)=>{
    let allListings=await Listing.find({}); //get all documents from listing collection
    res.render("./listing/index.ejs",{allListings});
});

//creating new listing 
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
});
 
//accepting Post req for creating new lisiting
app.post("/listings",async(req,res)=>{
 //let {title,description,image,price,location,country}=req.body; OR
//let listing=req.body.listing;
const newListing=new Listing(req.body.listing); //inserting by using Model(new Lisitng)
await newListing.save();
res.redirect("/listings");
});

//show route 
app.get("/listings/:id",async(req,res)=>{
let {id}=req.params;
const listing=await Listing.findById(id);
res.render("listing/show.ejs",{listing});
}); 

//edit route 
app.get("/listings/:id/edit",async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    console.log(listing);
    res.render("listing/edit.ejs",{listing});
});

//update route
app.put("/listings/:id",async(req,res)=>{
let{id}=req.params;
await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
let {id}=req.params;
let deletedListing=await Listing.findByIdAndDelete(id);
console.log(deletedListing);
res.redirect("/listings");
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

