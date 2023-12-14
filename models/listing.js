const mongoose = require("mongoose");
const review=require("./review.js");
const { string } = require("joi");

const Schema = mongoose.Schema; // Make sure to use mongoose.Schema



const list = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        
        url:String,
        filename:String,
        
        
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId, // Use mongoose.Schema.Types.ObjectId
            ref: "Review",
        }
    ],
    owner: {
        id: String, 
        username: String,
        email: String,
      },
});

list.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await review.deleteMany({reviews:{$in:listing.reviews}});

    }
    
});

const listitems = mongoose.model("listitems", list);

module.exports = listitems;
