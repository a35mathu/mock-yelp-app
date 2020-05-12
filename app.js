var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost:27017/yelpCamp", {useNewUrlParser: true}) //yelpcamp is the name of the database
    app.use(bodyParser.urlencoded({extended: true})); //memorize, will need to do this for each package to be used by express
    app.set("view engine", "ejs"); //so we dont need to add ejs to the file being rendered.


    //schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


// Campground.create(
//     {
//         name:"campgroundTest",
//         image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPlIlNSzoTQS-NPghwdvyqlHl1wfZvVBzSzIm1kKlJd8DOPQrNwQ",
//         description: "beautiful site, great view, peaceful nights"
//     }, function(err, campground){ //callback function, runs after create is run
//     if(err){
//         console.log("error: " + err);
//     }
//     else {
//         console.log("Newly Created Campground" + campground);
//     }
// })


app.get('/', function(req, res){
res.render("landing"); //name of ejs file in quotes

});

app.get('/campgrounds', function(req, res){
//    res.render("campgrounds", {campgrounds:campgrounds}); //first is name we want, second is data we give it
//get all campground from db by using find()
Campground.find({}, function(err, allCampgrounds){
    if(err){
        console.log(err);
    }
    else{
        res.render("index", {campgrounds:allCampgrounds}); //first is name we want, second is data we give it
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
    // campgrounds.push(campground);
    // create new campground using .create

    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            // redirect to campgrounds page
            res.redirect("/campgrounds") //defaults to a get request
        }
    });

});

app.get("/campgrounds/new", function(req, res){ //this has to go bfore the :id url, bc that url will take any word to be id and this url wont be recognized.  order matters
res.render("new.ejs");

})
//SHOW --displays page wth description of campground
app.get("/campgrounds/:id", function(req, res){
    //find campground w/ id
    //show all info on this id (description)
    // res.send("description of id will be shown here!");
    Campground.findById(req.params.id, function(err, foundCampground){ //found campground is what is returned from function
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









// var campgrounds = [
//     {name: "Salmon Creek", image:"https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fcdn-image.travelandleisure.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F1600x1000%2Fpublic%2F1443561122%2FCAMPING0915-Glacier-National-Park.jpg%3Fitok%3D6gQxpDuT&q=85"},
//     {name: "Rouge Hill", image:"https://www.sunset.com/wp-content/uploads/4_3_horizontal_inbody_900x506/fall-camping-best-campgrounds-organ-pipe-cactus-national-monument-twin-peaks-1115.jpg"},
//     {name: "Cobourg", image:"https://img-aws.ehowcdn.com/560x560p/s3-us-west-1.amazonaws.com/contentlab.studiod/getty/5586a26c05d44eb0bb08d28353e2ddaa"}
// ]
