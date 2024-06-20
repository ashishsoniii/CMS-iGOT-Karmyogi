const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const mongoURI = "mongodb+srv://soni:1234567890@igot.lvt1lby.mongodb.net/iGOT_CMS?retryWrites=true&w=majority";

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; 
  }
}

module.exports = {
  mongoose,
  connectToDatabase,
};
