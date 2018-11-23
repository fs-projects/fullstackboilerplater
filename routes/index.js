var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/users");
var passport = require("passport");


/**************************LANDING PAGE ROUTE*********************************************/ 
/********************************************************************************************/
router.get('/', function(req,res){
   res.render("landing"); 
});


/**************************AUTHENTICATION ROUTES*********************************************/ 
/********************************************************************************************/


//Display registration page
router.get('/register', function(req, res) {
   res.render("register");
});


//Process the registration page data here
router.post('/register', function(req, res) {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(error, user){
        if(error){
            //This error object in the callback is actually coming from passport.js once the user registeration process is done. This error object has three things
            //in it. One is an array and other two are the key value pairs namely 'name' and 'message', an all three are in single JSON object. We are printing
            //the 'message' value of the field that came from the error response and printing out in our flash message.
            console.log("there is some error in registering the user", error);
            req.flash("error", error.message);
            return res.render("register");
        }       
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds"); 
        });
   });
});


//Display login page
router.get('/login', function(req, res) {
    //Here we have this object being sent to the 'login' template. The object has a 'message' field that is being passed with the value as 'req.flash("error")'.
    //The value is coming from the '/login' route only in those cases if the user is NOT logged in successfully. 
    res.render("login"); //{message: req.flash("error")} -- commented it out because, now we are using 'app.js' file to send the 'message' to each an every route
    //that we have defined.
});


//Process the login page form data here and redirect accordingly 
//'passport.authenticate' method with 'local' and '{....}' arguments is acting as a middleware. This means that the callback function will only be called
//once the middleware has successfully executed. 
router.post('/login', passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
    //Keeping it empty as we assume that middleware will work just fine and would be able to handle the authentication and then appropriate redirects 
});


//Process the logout request
router.get('/logout', function(req, res) {
   req.logout();
   //Below statement assigns the text 'Successfully logged out!' without quotes to 'success' field(without quotes) and doesn't flash the message to the user 
    //unless there is a page on which after this statement to which the user/route is directed to.
    //The statement will not display/flash anything for us in the page, it will just give us the capability of accessing the message 'Successfully logged out!' stored in
    //the 'success' variable in the next page i.e the page where we have set the redirect path i.e '/campgrounds' route. Now we are clear that "success" variable will 
    //be available to '/campgrounds' route. So what our next step should be, is to handle that information in the request about the flash message in the '/campgrounds' route.
    //See the '/campgrounds' route to see how it is handled OR if that logic is commented there then it means that we have configured below flash message in 
    //'app.js' file so that this message is sent to each and every route that we have defined. Also this statement MUST be written before the redirect actually
    //takes place. 
    req.flash("success", "Successfully logged out!");
    res.redirect("/campgrounds");
});


//Exporting the router object so that the file 'app.js' can use that object to import the route there.
module.exports = router;