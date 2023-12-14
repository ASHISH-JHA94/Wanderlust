const mongoose=require("mongoose");
const listitems=require("../models/listing");
const initdata=require("./data.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
.then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});



const initdb = async () => {
    await listitems.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: {
        id: "exampleOwnerID", 
        username: "exampleUsername",
        email: "exampleEmail@example.com",
      },
    }));
    await listitems.insertMany(initdata.data);
  
    console.log("Data was initialized");
  };
  
  initdb();
  
  


