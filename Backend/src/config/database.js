const mongoose = require("mongoose");

//  MongoDB connection URI 
const mongoURI = "mongodb://127.0.0.1:27017/iGOT_CMS";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = {
  mongoose, 
};
