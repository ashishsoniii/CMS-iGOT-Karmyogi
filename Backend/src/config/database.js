const mongoose = require("mongoose");

//  MongoDB connection URI 
const mongoURI = "mongodb+srv://soni:1234567890@igot.lvt1lby.mongodb.net/iGOT_CMS";

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
