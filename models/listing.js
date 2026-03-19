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
        type: String,
        default:"https://www.freepik.com/free-photo/house-isolated-field_10025444.htm#fromView=keyword&page=1&position=1&uuid=c699ce71-2b54-4803-b964-65b2929c8818&query=Housedefault link", //if img is undefind i.e the img is not comming 
        set:(v)=> v===""?"https://www.freepik.com/free-photo/house-isolated-field_10025444.htm#fromView=keyword&page=1&position=1&uuid=c699ce71-2b54-4803-b964-65b2929c8818&query=Housedefault link":v,
    }, //here ternery operator is used if the user don't put any image then the default img will be used;
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    }
});

//creating model from listing Schema
const Listing = mongoose.model("Listing", listingSchema);

//exporting to app.js
module.exports= Listing;