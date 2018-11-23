//Must import statements that are required to use express
var express = require("express");
//In this statement we are executing the express as a function and obtaining it's returned object and saving it in 'app' variable so that we can futher use 
//this app variable(technically an object) to call various functions on it, like 'use' and 'set' etc.
var app = express();


//Below statement is importing the body-parser package that will allow us to parse the body of http request coming from a form into a JSON format so 
//that we can use that  body object to obtain various parameter and process as per our needs. By default the http request coming from a form is 
//is a text and not JSON object that we actually need to read and understand various parts of data.
var bodyParser = require("body-parser");
//Below statement is a must to write in order to successfully use body-parser, just memorize it but I will try and find the meaning of it someday.
app.use(bodyParser.urlencoded({extended:true}));


//The reason we specified this statement is because, by default express only serves the contents of the views directory and NOT any other directory
//so to tell express to serve the contents of the public directory we have to specify below statement. 
app.use(express.static(__dirname + "/public"));


//The reason why are writing this statement is because, we want to tell Express ahead of time that the file names we are referring in this file are of 'ejs' type
//this will ensure that even if we don't specify the '.ejs' extension of the filenames, then also our code would work fine because we have already specified this 
//point using below statement.
app.set("view engine", "ejs");


//Below statement is using the request object from 'request' package that we have already installed in our ThirdExpressApp directory using npm install. You can 
//also check the package.json file for the details. This package will allow us to work with API calls and response. 
var request = require("request");


//The method-override is a package we used to ensure that the "put" route that we have specified below that has the logic to update the post, this route is invoked
//as soon as someone updates an existing post. By default HTML forms are submitted via 'GET' and 'POST' method only. We can use the 'POST' method also to achieve
//the same functionality but we are doing in this mannner to follow the restful convention i.e those 8 routes logic as defined above in the tabular data.
var methodOverride = require("method-override");
app.use(methodOverride("_method"));


//I have installed this package to make sure that when a post is created or updated then the content that user has entered in the text body, if it contains any
//script tags must be removed before actually rendering it to the browser.
var expressSanitizer = require("express-sanitizer");
app.use(expressSanitizer());


//Requiring passport
var passport = require("passport");


//Requiring passport-local
var LocalStrategy = require("passport-local");


//Requiring passport-local-mongoose
var passportLocalMongoose = require("passport-local-mongoose");


//This is done to so that we can use express-session module within our application. We are using 'require' as function with arguments, the arguments being 
//passed to is an object with 3 fields as shown below
app.use(require("express-session")({
    //this is a key that will be used to decode the information exchanged in the session
    secret: "leoblack2601",
    //mandatory requirement
    resave: false,
    saveUninitialized: false
}));


//These two are mandatory 'use' that are required to setup the passport so that we can use it in our application. Must write statements in order for 'passport'
//to work
app.use(passport.initialize());
app.use(passport.session());


//Requiring the 'User' model same way as we did for 'Campground' and 'Comment' model below.
var User = require("./models/users");


//Here we are creating a new LocalStrategy and passing an object to it as an argument. The object being passed is returned from calling the method
//'authenticate' on 'User' model. The calling of 'authenicate' method on 'User' model is possible due to the 'passport-local-mongoose' that we required in 
//users.js file. 
passport.use(new LocalStrategy(User.authenticate()));


//These two statements are reponsible for reading the session, taking the data from the session and decoding(deserializeUser) it and then encoding(serializeUser)
//it back put it back in the session without having us to serialize and deserialize the user with our own methods.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//This package was included in this project to display the alerts to the user in various cases like when user is not logged in, user is logged out, user's comments
//are saved successfully etc. As per Colt's lecture, flash requires some other configuration like 'cookieParser' and 'session' from 'express-session' module. 
//Since we already have that covered when we included 'express-session', so now we don't need to configure that here for flash. 
var flash = require("connect-flash");
app.use(flash());


//Since I have installed mongoose using npm install I can now use it in this file as below like we did for many other packages too
var mongoose = require("mongoose");


//We have to tell mongoose to connect to the mongod server that we are running here in cloud9 and to do that we have to use below command. yelp_camp is the 
//the name of the database that we want to connect to in the mongod server. If restful_blog_app is not present in the running mongod server, restful_blog app
//named database will be created otherwise the one existing already will be used.
//If you will not use { useNewUrlParser: true } then you will get this error (node:4833) DeprecationWarning: current URL string parser is deprecated,
//and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
//source : https://stackoverflow.com/questions/50448272/avoid-current-url-string-parser-is-deprecated-warning-by-setting-usenewurlpars
//mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });


//Below statement will allow us to connect our application to the database hosted in MLAB servers in cloud where we have created our new account and created
//a user 'yelpcampuser1' for our database 'fsprojectsyelpcamp'.
mongoose.connect("mongodb://yelpcampdbuser1:W0rk@@@@@@Hard@ds111748.mlab.com:11748/fsprojectsyelpcamp", { useNewUrlParser: true });


//This is how we are importing the 'Campground model into this 'app.js' for 2 reasons: --> to make our 'app.js' as clean as possible and --> to make
//clarity in our structure, means, we will be adding 'User' and 'Comment' model in future so we will keep all those in separate files as that of the
//'Campground' and export those models here in our app.js like we did here for 'Campground' model.
//This is the way to include the models used in our code, for example in here we will be using three models : 'Campgrounds', Comments', 'User', so using 
//module export we are returning those models from campgrounds.js and comments.js and users.js file and requiring those models here in this file. 
//Important point to note is that './' is used so that while compiling this file, node will look for campgrounds.js, comments.js file and users.js file 
//in the models directory present that is present in the 'current' directory. './' acutally is guiding node to search in the current directory i.e 'YelpCamp' 
//directory. It is also NOT necessary that the 'module.exports' variable in the 'campgrounds.js', 'comments.js' and 'users.js' file should always return a single object
//like in our case, the Campground/Comment/User models but we can return multiple objects also. We haven't specified the '.js' extension of files 'posts' and 'users'
//because by default express understand this syntax and will pickup the '.js' file. The concept should NOT to be confused with 'ejs' package that lets
//express check for the 'ejs' file when the name of the file is specified in a route is specified without an extension.
var Campground = require("./models/campgrounds");


//Importing the 'Comment' model the same way we did for 'Campground' model just above. 
var Comment = require("./models/comments");


//Here we are first requiring the seedDB function from seeds.js file and then executing that function using seedDB() statement.
//The function if successfully executed would remove all existing posts from yelp_camp database and insert 5 new pre decided campgrounds
//specified in the seeds.js file, in the yelp_camp database everytime this app.js is loaded.
var seedDB = require("./seeds");


//Read the code in 'seeds.js' to understand what this function is doing overall and in below statement we are just calling that function imported from above
//statement.
//seedDB(); ---> Commenting this function out because we don't have any requirement to remove and add campgrounds/comments every time we run 'app.js' file.


//Below is the way to create a campground but here we have an advantage that campground is created and saved in one single step instead of two.
//Below piece of code was written to add the campgrounds to our mongodb database, but now since we have to run this file we don't want to create and save
//the below campground again and again, I could have deleted this piece of code but I am keeping it for someone who will read the comments will come to know
//some background as to why this piece of code was removed in first place.
// Campground.create(
//     {
//         name : "Salmon Creek", 
//         image : "https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104496f9c871a2ecb4b8_340.jpg",
        
//     }, function(err,campground){
//     if(err){
//         console.log("Something went wrong, check you server is running or the internet is working fine?");
//         console.log(err);
//     }
//     else{
//         console.log("Saved campground successfully!");
//         console.log(campground);
//     }
// });


//Tell the express to listen on the specific PORT and IP address, which for this case is the PORT and IP address of the environment hosted by CLOUD9
//Also note that the console logging statement in the callback function is showing that the console being logged on to is actually the console that we are 
//using to run our node commands and it is not to be misunderstood with the console logging on the browser console. Creation of listeners are important
//before sending any response to the client who is asking for a http response for it's http request sent earlier.
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Server has been started!")
});


//We no longer need campgrounds array because we are now using mongodb to store our database:
// var campgrounds = 
//         [
//             {name : "Salmon Creek", image : "https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104496f9c871a2ecb4b8_340.jpg"},
//             {name : "Granite Hill", image : "https://farm3.staticflickr.com/2947/15215548990_efc53d32b6.jpg"},
//             {name : "Mountain Goat's Rest", image : "https://pixabay.com/get/e835b20e29f7083ed1584d05fb1d4e97e07ee3d21cac104496f9c87fafe9bdbc_340.jpg"},
//         ]


//LIST OF ROUTES COVERED IN THIS APP 
// '/' : showing the landing page 
// INDEX : /campgrounds as GET showing all the campgrounds
// NEW : /campgrounds/new as GET showing the add new campground form
// CREATE : /campgrounds as POST and processes the POST request from the add new campgrounds form 
// SHOW : /campgrounds/:id as GET to show the specific campground that is being clicked on it's 'Read More' button

/*Comment Routes below*/

//NEW : /campgrounds/:id/comments/new as GET to show a form where user can add a comment specific to a campground on which that comment is required.
//CREATE : /campgrounds/:id/comments as POST to process the POST request coming form the new comments form page


//This is a mandatory middleware that will run and ensure that it always send the 'currentUser' as 'req.user', as an argument to each and every route that we have
//defined below. example of this middleware sending the parameter and value is shown in this statement that I pulled from the GET route '/campgrounds' logic
// ---->res.render("campgrounds/index", {campgrounds:campgrounds, currentUser:req.user});<----
//The reason to do this is that we want to use 'req.user'(passport enables us to retreive this information) information to each of the route so that we can use 
//that information and display the 'login', 'signup', 'logout' buttons appropriately to the user depending on whether they are signed in or not. Also we need 
//this 'req.user' information to grab the user that is current signed in and display it on the navbar as 'Signed In As...'.
app.use(function(req,res,next){
    //req.user is populated by 'passport' in the 'req' once the user has successfully logged in, this is the reason why we are able to grab it. Also it will be 
    //null if the user is not able to authenticate. 
    res.locals.currentUser = req.user;
    //The value of 'res.locals.message', once assigned in the 'isLoggedIn()' middleware will be assigned here and passed to each of the routes that we have created. 
    res.locals.error = req.flash("error");
    //The value of 'res.locals.message', once assigned in the route '/logout' will be assigned here and passed to each of the routes that we have created. 
    res.locals.success = req.flash("success");
    //calling next() is mandatory here because it will ensure that once the above assignment has been the route handler(the code that is between the callback and 
    //middleware) must run.
    next();
});


//Requiring the routes from 'campgrounds.js', 'comments.js' and 'index.js' files that are stored in 'routes' directory. This has been done to make our 'app.js'
//readable, concise and follow a structure. This will help us scale this application fast as we proceed and number of other features in this application.
var campgroundRoutes = require("./routes/campgrounds");
var commentsRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");


//we need to use 'app' object and call 'use' method on it by passing the required object as second argument that contains our routes so that node knows about 
//all these routes while compiling. Also notice here that we have passed first argument as a path that will be prepended to each of the route specified in the 
//routes file to which the second argument is pointing to.
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use("/", indexRoutes);


//IF NONE OF THE ROUTES MATCH, BELOW WILL RUN
app.get('*', function(req, res) {
   //console.log("Someone requested for a page that doesn't exist..");
   res.send("Sorry, page not found..What are you doing with your life?");
});