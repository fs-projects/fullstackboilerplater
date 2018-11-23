var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var Comment = require("./models/comments");


var data = 
    [
        {
            "name" : "Granite Hill", 
            "image" : "https://farm3.staticflickr.com/2947/15215548990_efc53d32b6.jpg",
            "description" : "A rough place of Granite rocks with a high temperature and small day span.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quam dolor, dignissim eget ultricies ut, convallis at justo. Nulla sollicitudin nisl tincidunt consectetur feugiat. Suspendisse ornare mauris in metus efficitur mollis. Fusce libero sapien, finibus sed massa eu, tempus vehicula lorem. Nunc porttitor velit in nibh maximus cursus. Aliquam a aliquet mauris. Donec in iaculis erat, non varius massa. Nullam lacinia velit auctor, commodo turpis ut, varius erat. Ut nisl augue, posuere a malesuada non, sodales non libero. Donec pulvinar arcu vitae felis iaculis, et efficitur ante bibendum. Sed tincidunt ornare massa, ac rutrum dolor molestie vel." 
        },
        {
            "name" : "Salmon Creek", 
            "image" : "https://farm8.staticflickr.com/7676/18104098881_b4bd26ceb9.jpg",
            "description" : "Home of Grizzly bears and lots of Salmon fish.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quam dolor, dignissim eget ultricies ut, convallis at justo. Nulla sollicitudin nisl tincidunt consectetur feugiat. Suspendisse ornare mauris in metus efficitur mollis. Fusce libero sapien, finibus sed massa eu, tempus vehicula lorem. Nunc porttitor velit in nibh maximus cursus. Aliquam a aliquet mauris. Donec in iaculis erat, non varius massa. Nullam lacinia velit auctor, commodo turpis ut, varius erat. Ut nisl augue, posuere a malesuada non, sodales non libero. Donec pulvinar arcu vitae felis iaculis, et efficitur ante bibendum. Sed tincidunt ornare massa, ac rutrum dolor molestie vel."
        },
        {
            "name" : "Mountain Goat's Rest", 
            "image" : "https://images.unsplash.com/photo-1500581276021-a4bbcd0050c5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d4c6f1e147755aaf14f158a34e0ea68f&auto=format&fit=crop&w=500&q=60",
            "description" : "A place of strong flowing water with cold breeze throughout the winters.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quam dolor, dignissim eget ultricies ut, convallis at justo. Nulla sollicitudin nisl tincidunt consectetur feugiat. Suspendisse ornare mauris in metus efficitur mollis. Fusce libero sapien, finibus sed massa eu, tempus vehicula lorem. Nunc porttitor velit in nibh maximus cursus. Aliquam a aliquet mauris. Donec in iaculis erat, non varius massa. Nullam lacinia velit auctor, commodo turpis ut, varius erat. Ut nisl augue, posuere a malesuada non, sodales non libero. Donec pulvinar arcu vitae felis iaculis, et efficitur ante bibendum. Sed tincidunt ornare massa, ac rutrum dolor molestie vel."
        },
        {
            "name" : "Indian Heaven", 
            "image" : "https://farm9.staticflickr.com/8805/17916038519_69cb4af3f7.jpg", 
            "description" : "This is a india place near Kerala with lots of scenic beauties.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quam dolor, dignissim eget ultricies ut, convallis at justo. Nulla sollicitudin nisl tincidunt consectetur feugiat. Suspendisse ornare mauris in metus efficitur mollis. Fusce libero sapien, finibus sed massa eu, tempus vehicula lorem. Nunc porttitor velit in nibh maximus cursus. Aliquam a aliquet mauris. Donec in iaculis erat, non varius massa. Nullam lacinia velit auctor, commodo turpis ut, varius erat. Ut nisl augue, posuere a malesuada non, sodales non libero. Donec pulvinar arcu vitae felis iaculis, et efficitur ante bibendum. Sed tincidunt ornare massa, ac rutrum dolor molestie vel."
        }
    ];

//This function is removing all the existing campgrounds inside the campgrounds collection in yelp_camp db, then it is removing all the existing comments
//inside the comments collections and then adding 4 new campgrounds objects from 'data' array and then adding one common comment to each of the campground
//that is being added, handling errors and success throughout the process.
function seedDB(){
    Campground.remove({}, function(error){
        
        
        //The reason for commenting this section out was that when we run 'app.js' via node, we don't want to remove existing campgrounds and populate again. 
        //So I will be running his 'remove' function once and the will comment out the call to seedDB() in 'app.js' so that from future none of the already 
        //populated campgrounds are deleted.
        
        
        // if(error){
        //     console.log("there was some error deleting the campgrounds collections from the yelp_camp database!");
        //     console.log("===========================================================================================================");
        // }
        // console.log("'campgrounds' collection from yelp_camp database deleted successfully!");
        // console.log("===========================================================================================================");
        // Comment.remove({}, function(error){
        //     if(error){
        //         console.log("there was some error deleting the comments collections from the yelp_camp database!");
        //         console.log("===========================================================================================================");
        //     }
        //     console.log("'comments' collection from the yelp_camp database deleted successfully!");
        //     console.log("===========================================================================================================");
        //     data.forEach(function(seed){
        //         Campground.create(seed, function(error,campground){
        //             if(error){
        //                 console.log("there was some error creating the campground in the yelp_camp database, campground and error respectively are", seed, error);
        //                 console.log("===========================================================================================================");
        //                 }
        //             else{
        //                 console.log("campground saved successfully in the yelp_camp database!");
        //                 console.log("Moving to add comments to this campground now..");
        //                 Comment.create(
        //                     {
        //                         text: "This is a common comment for all the starting post. Just one common comment",
        //                         author : "Utkarsh Kukreti"
        //                     },
        //                     function(error, comment) {
        //                         if(error){
        //                             console.log("there was some error creating the comments for the posts, comment and error respectively are", seed, error);
        //                             console.log("===========================================================================================================");
        //                         }
        //                         else{
        //                             campground.comments.push(comment);
        //                             campground.save(function(error, comment){
        //                                  if(error){
        //                                     console.log("there was some error saving comment in db", error, comment);
        //                                  }
        //                                 else{
        //                                     console.log("comment added to the post", comment, seed);
        //                                     console.log("===========================================================================================================");
        //                                 }
        //                             });
        //                         }
        //                     });
        //                 } //else of campground created closed
        //             }); // campground created closed
        //     }); //data.forEach closed 
        // }); //comment remove closed
     }); //campground remove closed
};//seedDB function closed

module.exports = seedDB;