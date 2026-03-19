//logic of initialization just initialize once to add sample data to database it also delete the previous collection in databases;  

const initData = require("./data.js"); //sample data 
const Listing = require("../models/listing.js"); //model of listing 

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


//first freeup the database and then adding sample database
const initDB = async () => {
    await Listing.deleteMany({}); //deleting from collection named listing 
    await Listing.insertMany(initData.data); //initdata is obj and accessing the data inside it (data is alis of samplelisting from data.js) and initData is required from it which is obj
    console.log("data was initialized");
};

initDB();

