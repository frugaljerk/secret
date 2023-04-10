//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const MONGODB_LOCAL = "mongodb://127.0.0.1:27017/userDB";
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});


const User = new mongoose.model("User", userSchema);



const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get("/", async (req, res) => {

        await mongoose.connect(MONGODB_LOCAL);
        res.render("home");
        await mongoose.disconnect();
      }
    
);

app.get("/login", function(req, res){
    res.render("login");
});
app.post("/login", async(req, res)=>{
    await mongoose.connect(MONGODB_LOCAL);
    const user = await User.findOne({email:req.body.username});
    if(user != null){
        if (user.password == req.body.password){
            res.render("secrets");
        }else{
            console.log("Password Error");
            res.redirect("/");
        }
    }else{
        console.log("User Not Found");
        res.redirect("/");
    }
    await mongoose.disconnect();
});



app.get("/register", function(req, res){
    res.render("register");
});
app.post("/register", async (req, res) => {
    await mongoose.connect(MONGODB_LOCAL);
    const new_user = new User({email: req.body.username, password: req.body.password})
    await new_user.save();
    console.log(new_user);
    res.render("secrets");
    await mongoose.disconnect();
});


app.listen(3000, function(){
    console.log("Server started on port 3000.");
})