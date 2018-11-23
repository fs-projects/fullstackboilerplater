var mongoose = require("mongoose");

//We have to define a schema of the data we are supposed to be storing in the mongodb. This schema will contain the different properties of the object
//that we are interested in storing. This is like a schema of a relational database but the point to note is that we can have the objects with the properties
//defined in the schema saved to our mongodb in such a way that some object can have some properties and some don't, basically it is not necessary that the objects
//to be saved in the database should have all the properties defined in the schema. Take the schema as the predictable way of anticipating the type of data we could
//expect with the object that we want to save, however it is subject to change anytime and that's fine if you are using mongodb.
var campgroundSchema = new mongoose.Schema({
   name: String,
   price:String,
   image: String,
   description: String,
   author: {
      id:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User"
      },
      username: String
   },
   comments:
   [
       {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
       }
   ]
});

//Below we are using the campgroundSchema and we are compiling into a model and saving to a variable 'Campground'. This variable 'Campground' is an object that
//we can use to make new campground objects, update existing campgrounds, delete campgrounds, find campgrounds etc. Basically this complex 'Campgrounds' variable 
//will have the methods that we want to use as CRUD operations. "Campground" in the parameter to the mongoose.model should always be singular version of your collection name. 
//Mongoose is pretty smart in using this singular name and making it plural lower case while creating the collection like for "Campground" mongoose will make 
//'campgrounds' collections in the yelp_camp database.
module.exports = mongoose.model("Campground", campgroundSchema);