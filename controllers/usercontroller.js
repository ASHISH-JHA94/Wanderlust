const User=require("../models/user.js")
module.exports.opensignuppage=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.postsignup=async (req, res) => {
    try {
        let { username, email, password } = req.body; 
        const newUser = new User({ email, username }); 
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);

            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listing");

        });
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    } 
};

module.exports.openloginpage=(req,res)=>{
    res.render("users/login.ejs"); 
};

module.exports.postlogin=async(req,res)=>{
    req.flash("success","welcome to wanderlust!");
    console.log(res.locals.redirectURL);
    let redirecturl=res.locals.redirectURL || "/listing";
    
    
    res.redirect(redirecturl);
};

module.exports.logout=(req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        else{
            req.flash("success", "you are successfully logged out");
            res.redirect("/listing");

        }
        
    });
};


