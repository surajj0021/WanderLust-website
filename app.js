//requiring express
const express=require("express");
const app=express();

//requiring mongoose
const mongoose=require("mongoose");
//node connection to database
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
.then(res=>{
    console.log("Database connection succesfull");
})
.catch(err=>{
    console.log(err);
});

//server starting or listening for commands
app.listen(8080,()=>{
    console.log("server is started");
});

//basic api request 
app.get("/",(req,res)=>{
  res.send("Root is Working");
});