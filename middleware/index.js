var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middlewareObj = {};


//CREATING A MIDDLEWARE TO CHECK FOR AUTHORIZATION OF A USER TO VIEW/MANIPULATE A CAMPGROUND PAGE. We have inserted this middle ware in 'edit/update/delete' routes
//This will ensure that only the user who has the right authorization is making changes to a campground i.e the user who has created a campground can only make
//changes to that campground. In this middleware, we are first checking if the request that came to user is 'authenticated' or not? If it is we go ahead an find
//the campground using the req.params.id and then makes a very important comparison that ensures the authorization of a user. We compare the 'id' of the author of
//the campground with the 'id' field in 'req.user'. 'req.user' is always populated by passport with 'username' and '_id' once the request is authenticated by
//passport.
middlewareObj.checkCampgroundOwnership = 
function (req,res,next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(error, foundCampground){
                if(error){
                    console.log("There is some error finding the campground in the yelp_camp db", error);
                    req.flash("error", "Campground not found in the database!");
                    res.redirect("back");
                }
                else{
                    console.log("I am in checkCampgroundOwnership function and inside else clause where campground was found...");
                    //if(foundCampground.author.id === req.user._id)--I haven't used this comparsion because foundCampground.author.id is Mongoose Object ID whereas
                    //req.user.id is a text field. So even if we console.log both these values, the will look exactly same visually but in terms of types they aren't
                    //equal. So we have used '.equals' function provided by Mongoose for comparison for these specials cases.
                    if(foundCampground.author.id.equals(req.user._id)){
                        console.log("foundCampground.author.id and req.user._id", foundCampground.author.id, req.user._id);
                        console.log("I am in checkCampgroundOwnership function and inside if clause where authorization comparsion check is being done...");
                        next();
                    }
                    else{
                        console.log("I am in checkCampgroundOwnership function and inside if clause where authorization fails...");
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                }
            });
        }
        else{
            console.log("I am in checkCampgroundOwnership function where authentication fails and user is redirected back from where he came from...");
            req.flash("error", "You need to login to do that!");
            res.redirect("/login");
        }
    };


//CREATING A MIDDLEWARE TO CHECK FOR AUTHORIZATION OF A USER TO VIEW/MANIPULATE A CAMPGROUND PAGE. We have inserted this middle ware in 'edit/update/delete' routes
//This will ensure that only the user who has the right authorization is making changes to a campground i.e the user who has created a campground can only make
//changes to that campground. In this middleware, we are first checking if the request that came to user is 'authenticated' or not? If it is we go ahead an find
//the campground using the req.params.id and then makes a very important comparison that ensures the authorization of a user. We compare the 'id' of the author of
//the campground with the 'id' field in 'req.user'. 'req.user' is always populated by passport with 'username' and '_id' once the request is authenticated by
//passport.
middlewareObj.checkCommentOwnership = 
function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(error, foundComment){
            if(error){
                console.log("There is some error finding the comment in the yelp_camp db", error);
                req.flash("error", "Something went wrong while finding the comment in the database..");
                res.redirect("back");
            }
            else{
                console.log("I am in checkCommentOwnership function and inside else clause where comment was found...");
                //if(foundCampground.author.id === req.user._id)--I haven't used this comparsion because foundCampground.author.id is Mongoose Object ID whereas
                //req.user.id is a text field. So even if we console.log both these values, the will look exactly same visually but in terms of types they aren't
                //equal. So we have used '.equals' function provided by Mongoose for comparison for these specials cases.
                if(foundComment.author.id.equals(req.user._id)){
                    console.log("foundComment.author.id and req.user._id", foundComment.author.id, req.user._id);
                    console.log("I am in checkCommentOwnership function and inside if clause where authorization comparsion check is being done...");
                    next();
                }
                else{
                    console.log("I am in checkCommentOwnership function and inside if clause where authorization fails...");
                    req.flash("error", "The user has no authorization to edit this comment!");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        console.log("I am in checkCommentOwnership function where authentication fails and user is redirected back from where he came from...");
        req.flash("error", "Please login to add comments!");
        res.redirect("/login");
    }
};

    
//This is a middleware function and we can define as many middleware as we want. Each and every middleware has a 'req', 'res' and 'next' arguments. The argument
//'next' denotes whether the next item will execute or not. So here in our case when the request to access certain page comes then it comes to the route that is
//handling that request which is repsonsible for processing the logic on that request. It will have a middleware function called in it which is defined below. 
//So if the request that came to route '/required_route' is authenticated then the function will return 'next()' to middleware that called below function from 
//the route '/required_route', the '/required_route' route will then proceed with it's next operation and show the page whatever that is being set, to the user 
//and run the callback function too. However if the request is not authenticated, then the request to route '/required_page' will get redirected to the route '/login'.
middlewareObj.isLoggedIn = 
function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //Below statement assigns the text 'Please Login first!' without quotes to 'error' field(without quotes) and doesn't flash the message to the user 
    //unless there is a page on which after this statement to which the user/route is directed to.
    //The statement will not display/flash anything for us in the page, it will just give us the capability of accessing the message 'Please Login First!' stored in
    //the 'error' variable in the next page i.e the page where we have set the redirect path i.e '/login' route. Now we are clear that "error" variable will 
    //be available to '/login' route. So what our next step should be, is to handle that information in the request about the flash message in the '/login' route.
    //See the '/login' route to see how it is handled OR if that logic is commented there then it means that we have configured below flash message in 
    //'app.js' file so that this message is sent to each and every route that we have defined. Also this statement MUST be written before the redirect actually
    //takes place. 
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};


module.exports = middlewareObj;