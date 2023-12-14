const listitems=require("../models/listing");
module.exports.index=async (req,res)=>{
    const list=await listitems.find({});
    res.render("listing/index",{ list});
};

module.exports.shownewlistingform=(req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.newlistingsave=async (req, res, next) => {
    // Create a new listing with the request body
    let url=req.file.path;
    let filename=req.file.filename; 
    console.log(url,"..",filename);
    const item = new listitems(req.body);
    
    // Assign the owner to the user's username
    item.owner = {
        id: req.user._id,         
        username: req.user.username,
        email:req.user.email,
    };
    item.image={url,filename}; 
    
    
    
    // Save the new listing
    await item.save();
    
    // Redirect and show a success message
    req.flash("success", "New listing created");
    res.redirect("/listing");
};

module.exports.getlistingbyid=async (req,res)=>{
    let {id}=req.params;
    const data = await listitems.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  })
  .populate("owner");

    if(!data){
        req.flash("error","requested listing doesnot exist");
        res.redirect("/listing");
    }
    console.log(data);
    res.render("listing/show.ejs",{data});
};

module.exports.findbyidandupdate=async (req,res)=>{
    
    let {id}=req.params;
    let listing=await listitems.findByIdAndUpdate(id,{...req.body});
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename; 
        listing.image={url,filename}; 
        await listing.save();


    }
    req.flash("success","Listing updated");
    res.redirect(`/listing/${id}`);
};

module.exports.editlistingbyidgetreq=async (req,res)=>{
    let {id}=req.params;
    const listing= await listitems.findById(id);
    if(!listing){
        req.flash("error","requested listing doesnot exist");
        res.redirect("/listing");
    }
    let originalimageurl = listing.image.url;
    let modifiedImageUrl = originalimageurl.replace("/upload", "/upload/w_250");
    res.render("listing/edit.ejs", { listing, originalimageurl: modifiedImageUrl });


    
};

module.exports.deletelistingbyid=async (req,res)=>{
    let {id}=req.params;
    let it=await listitems.findByIdAndDelete(id);
    console.log(it);
    req.flash("success","listing deleted");
    res.redirect("/listing");
};

module.exports.search=async (req,res)=>{
    const countryName = req.query.countryname;
    
    const list = await listitems.find({ country: countryName });
    console.log(list);
    if(list.length==0){
        res.send("sorry we have no any hotel there");
    }
    res.render("listing/index",{list});
    
    
    
    
}



