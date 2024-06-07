const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

// Import the database configuration
const dbConfig = require("./config/database");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send(`<h1>Home Page</h1>`);
});

// Start the server after ensuring database connection
dbConfig.mongoose.connection.once('open', () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

dbConfig.mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));
