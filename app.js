var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost:27017/yelpCamp", {useNewUrlParser: true}) //yelpcamp is the name of the database
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs"); //dont need to add ejs to filename when rendering template


    //schema setup using mongoose
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

app.get('/', function(req, res){
res.render("landing"); 

});

app.get('/campgrounds', function(req, res){
//get all campground from db by using find()
Campground.find({}, function(err, allCampgrounds){
    if(err){
        console.log(err);
    }
    else{
        //first is name we want, second is data we give it
        res.render("index", {campgrounds:allCampgrounds}); 
    }
    });
});

//allow a user to add a new campground by making a post request
app.post("/campgrounds", function(req, res){ 
    // get data from form -> req.body
    var name = req.body.name;
    var imageUrl = req.body.image;
    var desc = req.body.description;
// add new campground data to array
    var newCampground = {name: name, image: imageUrl, description: desc};
    
    // create new campground using .create
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            
            res.redirect("/campgrounds") //defaults to get
        }
    });

});
//this has to go before "/campgrounds/:id", bc that url will take any word to be id and this url wont be recognized. 
//** order matters **
app.get("/campgrounds/new", function(req, res){ 
res.render("new.ejs");

})
//SHOW --displays page wth description of campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){ //found campground by id
        if(err){
            console.log(err);
        }
        else{
            res.render("show", {campground: foundCampground}) //render show ejs file to browser
        }
    })
})

app.listen(3000, function(){
    console.log("YelpCamp Server has started");
});