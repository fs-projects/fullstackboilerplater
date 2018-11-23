var express = require("express");
//very important concept here is that we are passing the object argument {mergeParams: true} in the Router function. We are doing this because we have a 
//variable ':id' that we are passing in the comments route and has added "/campgrounds/:id/comments" in 'app.js' file as perpend string to be added to the
//comments route. If we don't merge the parameters then actual 'id' won't be passed to comments route while in create new comments route '/comments/:id/comments/new'  
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
//We have not specified 'index.js' file in the require path because the name 'index' is sufficient for express to find the functions. It will by default look for 
//the functions in 'index.js' file.
var middleware = require("../middleware");


/**************************CAMPGROUND ROUTES*************************************************/ 
/********************************************************************************************/


//Show all campground page
router.get('/', function(req,res){
    Campground.find({}, function(err,campgrounds){
        if(err){
            console.log("Something went wrong, check you server is running or the internet is working fine?");
            console.log(err);
        }
        else{
            //notice that the value 'campgrounds' being passed as a value to the parameter 'campgrounds', is an array of campgrounds
            //returned by the find() method on the Campgrounds object. This compgrounds array is being passed to the 'campgrounds.ejs' file for rendering 
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
    //Below line has been commented out by me because it will be used in just above /campground route but now it will be coming as an output of the find() method.
    // res.render("campgrounds", {campgrounds:campgrounds});    
});


//Show add new campground page 
router.get('/new', middleware.isLoggedIn, function(req, res){
    
    //render the form to user to create a new campground by submitting a form and get redirected to /campground page
    res.render("campgrounds/new");
});


//Process the data obtained from the new campround page
router.post('/', middleware.isLoggedIn, function(req, res){
    
    //get the data(name and image url) from form of create new camground and push the new campground to campgrounds array. Notice that the values of below three
    //variables are retrieved from the body and stored in the respective variables. The retrieval of these value is possible only due to body-parser package
    //that we have installed and express is using it functionality to retrieve the data. 
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    //add 'username' of the logged in user and '._id' to the 'author' object. Now the obvious question arises is that why do we have
    //'_id' and 'username' in our 'req' object? It's because this block of code was being executed because we know for sure that the user 
    //has been successfully authenticated. The middleware 'isLoggedIn' made sure of that. Also in this route or infact all the routes in this
    //application, there is a middleware in 'app.js' that passes and object {currentUser:req.user}, so req.user will be populated if the user
    //is successfully logged in else it will be an empty object {} and 'req.user._id' will always contain the '_id' of the campground. 
    var author = {
        id:req.user._id,
        username: req.user.username
    };
    //We are passing 'author' object from above so that it is saved to the campground collection and we can use it later to display the name of the person
    //who created this campground. The information of who created this campgrond will be displayed in campground 'show' page where we should the information
    //of about a specific campground. 
    var newCampground = {name : name, image : image, description : desc, author: author, price:price};
    Campground.create(newCampground, function(error, newlyCreatedCampground){
        if(error){
            console.log("There was some error creating the campground in yelp_camp", error);
        }
        else{
            //redirect to campgrounds page. Note that we have two /campgrounds route and the default behaviour is to redirect to the get route i.e app.get('/campground'...)
            res.redirect('/campgrounds');    
        }
    });
    
});


//Show specific camground page details when 'Read More' button is clicked
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("Something went wrong, check whether the server is running OR check your internet connection.");
            req.flash("error", "Strange, campground not found..");
            res.redirect("back");
        }
        else{
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });    
});


//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error){
            console.log("There was some error finding the campground", error);
            req.flash("error", "Strange, campground not found..");
            res.redirect("/campgrounds");
        }
        else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });    
});


//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.updatedCampground, function(error, foundCampground){
        console.log("updatedCampground object from the form is", req.body.updatedCampground);
        if(error){
            console.log("There was some error updating the campground", error);
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + foundCampground._id);
        }
    });    
});


//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
   Campground.findByIdAndRemove(req.params.id, function(error, deletedCampground){
        if(error){
            console.log("There was some error deleting the campground in database", error);
            res.redirect("/campgrounds");    
        }
        else{
            res.redirect("/campgrounds");
        }
   }); 
});


//Exporting the router object so that the file 'app.js' can use that object to import the route there.
module.exports = router;