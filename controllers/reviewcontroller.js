const listitems=require("../models/listing");
const Review=require("../models/review.js");
const User=require("../models/user.js")

module.exports.createreviewsforlistingid=async (req, res) =>{
    let listing = await listitems.findById(req.params.id);
    let newReview = new Review (req.body.review);
    newReview.author=req.user._id;
    console.log(newReview.author);
    console.log("------");
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    req.flash("success","New Review created");
    res.redirect(`/listing/${listing._id}`);
    
};

module.exports.deletereview=async (req, res) => { 
    let {id, reviewId } = req.params;
    await listitems.findByIdAndUpdate (id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review  deleted");
    res.redirect(`/listing/${id}`);
};
