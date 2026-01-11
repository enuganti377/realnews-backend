const mongoose = require("mongoose");



const connectDB = async () =>{

  try{
 await mongoose.connect(process.env.MONGO_URI);
 console.log("database is connected");
    
  }
  catch(error){
    console.error("database is not connected",error);
     process.exit(1);
  
  }
}
module.exports = {connectDB}