const express=require("express");
if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
};

let atlas_db=process.env.ATLAS_DB;



const app=express();
const mongoose=require("mongoose");
const listitems=require("./models/listing.js");
const data=require("./init/data.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const multer=require("multer");
const {storage}=require("./cloudConfig.js");
const upload=multer({storage});

const Review=require("./models/review.js");

const secretkey=process.env.secret;



const session=require("express-session");
const Mongostore=require("connect-mongo");

const flash=require("connect-flash");

const password=require("password");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

const {isLoggedIn}=require("./middleware.js");

const { saveRedirectUrl }=require("./middleware.js");

const {isOwner,validatelisting,validatereview,reviewOwner}=require("./middleware.js");

const listingcontroller=require("./controllers/listingcontroller.js");
const reviewcontroller=require("./controllers/reviewcontroller.js");
const usercontroller=require("./controllers/usercontroller.js");


const methodOverrride=require("method-override");
const passport = require("passport");
const review = require("./models/review.js");
// mongodb://127.0.0.1:27017/wanderlust

async function main(){
    await mongoose.connect(atlas_db);
}

main()
.then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});

// app.set("views",path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs",ejsMate);

app.use(methodOverrride("_method"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));

const store=Mongostore.create({
    mongoUrl:atlas_db,
    crypto:{
        secret:secretkey
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in Mongostore");
});

const sessionoptions={
    store,
    secret:secretkey,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }  

}



// app.get("/",(req,res)=>{
//     res.send("root working");
// });

app.use(session(sessionoptions));

app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 
    

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});
 



//open signup page
app.get("/signup",usercontroller.opensignuppage);

//register user after sign up
app.post("/signup", wrapAsync(usercontroller.postsignup));

//get login page
app.get("/login",usercontroller.openloginpage);


//authenticate user and redirect to the route for which he was searching
app.post("/login",saveRedirectUrl,passport.authenticate("local",
{failureRedirect:"/login",
failureFlash:true,}),
usercontroller.postlogin,

);

//logout user 
app.get("/logout",usercontroller.logout );


//search bar route
app.get("/search",listingcontroller.search);







//show Index route
app.get("/listing",wrapAsync(listingcontroller.index));
//new form get route
app.get("/listing/new",isLoggedIn,listingcontroller.shownewlistingform);

//save listing into database 
app.post("/listing", isLoggedIn,upload.single("image"), wrapAsync(listingcontroller.newlistingsave));





//SHOW listing by id 
app.get("/listing/:id",wrapAsync(listingcontroller.getlistingbyid));

//find listing by id and update
app.put("/listing/:id",isLoggedIn,upload.single("image"),wrapAsync(listingcontroller.findbyidandupdate));

//get request for edit listing by id 
app.get("/listing/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.editlistingbyidgetreq));


//delete listing by id
app.delete("/listing/:id",isLoggedIn,isOwner,wrapAsync(listingcontroller.deletelistingbyid));


//create a new review using listing id
app.post("/listing/:id/reviews",isLoggedIn,wrapAsync(reviewcontroller.createreviewsforlistingid ));

//delete review by id
app.delete(
    "/listing/:id/reviews/:reviewId",isLoggedIn,reviewOwner,saveRedirectUrl,wrapAsync(reviewcontroller.deletereview));





app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
  });
  
  

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("listing/error.ejs",{ err }); 
    // next(err);
    
});
app.listen("8080",()=>{
    console.log("listen on port 8080");
});