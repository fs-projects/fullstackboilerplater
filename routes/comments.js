var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
//We have not specified 'index.js' file in the require path because the name 'index' is sufficient for express to find the functions. It will by default look for 
//the functions in 'index.js' file.
var middleware = require("../middleware");


/**************************COMMENTS ROUTES*********************************************/ 
/********************************************************************************************/


//NEW : show new comments page via a GET call
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //find campgroound id, id that is populated in the url and present as 'params' in the req object that is sent when this route is being called'
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error){
            console.log("There is some error retrieving the campground data from yelp_camp db", error);
        }
        else{
            //pass the foundCampground from yelp_camp db and render new comments page
            res.render("comments/new", {campgrounds:foundCampground});
        }
    }); 
        
});


//CREATE : process the POST action of the new comments form here 
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(error, foundCampground) {
        if(error){
            console.log("There was some error finding the campground id in yelp_camp db", req.params.id);
            //this is a bad way to handle errors. Not useful for users who will just see themselves redirected and nothing was shown to them as to what
            //happpened.
            res.redirect("/campgrounds");
        }
        else{
            //create a new comment and save to the comments collection
            Comment.create(req.body.comment, function(error,comment){
                if(error){
                    console.log("There was some error creating the comment in yelp_camp db", error);
                    req.flash("error", "Something went wrong while creating the comment..");
                }
                else{
                    //add 'username' of the logged in user and '._id' to the comment that is being posted. Now the question arises is that why do we have
                    //'_id' and 'username' in our 'req' object?It's because this block of code was being executed because we know for sure that the user 
                    //has been successfully authenticated. The middleware 'isLoggedIn' made sure of that. Also in this route or infact all the routes in this
                    //application, there is a middleware in 'app.js' that passes and object {currentUser:req.user}, so req.user will be populated if the user
                    //is successfully logged in else it will be an empty object {} and 'req.user._id' will always contain the '_id' of the campground. 
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    //save comment to db
                    comment.save();
                    console.log("comment was successfully saved to the comments collection in yelp_camp db: ", comment);
                    //push the comment to the campround on which this comment was made
                    foundCampground.comments.push(comment);
                    //save campground to db
                    foundCampground.save(function(error, comment){
                        if(error){
                            console.log("There was some error saving the comment to the campground collection", error);
                            req.flash("error", "Something went wrong while saving the comment..");
                        }
                        else{
                            console.log("Comment was successfully saved to the campground collection!");    
                            req.flash("success", "Comment added successfully!");
                        }
                    });
                    //redirect to the campground page on which the comment was given
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});


//DISPLAY EDIT COMMENTS FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
   Comment.findById(req.params.comment_id, function(error, foundComment){
        if(error){
            console.log("There was some error finding comment in collections yelp_camp db", error);
            res.redirect("back");
        }
        else{
            Campground.findById(req.params.id, function(error, foundCampground){
                if(error){
                    console.log("There is no campground found by id and hence the error is", req.params.id, error);
                }
                else{
                    res.render("comments/edit", {campground: foundCampground, comment:foundComment});    
                }
            });
        }
   });
});


//PROCESS THE COMMENT UPDATE ON A PUT REQUEST FROM EDIT COMMENTS FORM
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedCommentOfCampground){
        if(error){
            console.log("There was an error updating the comment to comments collections in yelp_camp db", error);
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

 
//DELETE COMMENT
router.delete("/:comment_id/", middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(error, deleteComment){
       if(error){
           console.log("There was some error deleting the comment from comments collection in yelp_camp db", error);
           req.flash("error", "The was some error deleting the comment from comments collection in database");
           res.redirect("back");
       }
       else{
           console.log("Comment deleted successfully", deleteComment);
           req.flash("success", "Comment deleted successfully!");
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) 
});


//Exporting the router object so that the file 'app.js' can use that object to import the route there.
module.exports = router;