const listitems = require("./models/listing");
const review = require("./models/review");
const { listingSchema,reviewSchema }=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //SAVE ORIGINAL URL WHERE REQUEST IS MADE
        req.session.redirectURL=req.originalUrl;
        
        
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL=req.session.redirectURL;
    }
    next();
};

module.exports.isOwner= async (req,res,next)=>{
    let {id}=req.params;
    let listing=await listitems.findById(id);
    console.log(listing);
    
    if(!res.locals.curruser._id.equals(listing.owner.id)){
        req.flash("error","you are not the owner");
        return res.redirect(`/listing/${id}`);
    }
    next();

}
module.exports.reviewOwner= async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let revi=await review.findById(reviewId);
    
    console.log(revi.author);
    if(!revi.author.equals(res.locals.curruser._id)){
        req.flash("error","you are not the owner");
        return res.redirect(`/listing/${id}`);
    }
    next();

}

module.exports.validatelisting = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        const statusCode = 400;
        next(new ExpressError(statusCode, errorMessage));
    }
    next();
};

module.exports.validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        const statusCode = 400;
        throw new ExpressError(statusCode, errorMessage);
    } 
    next();
};

