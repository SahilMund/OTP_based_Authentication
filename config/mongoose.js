const mongoose = require("mongoose");
require("dotenv").config();

const connectionString = process.env.MONGO_URL + process.env.DB_NAME;

//connect to the database
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//acquire the connection
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error connecting to MongoDB"));

// once the connection is established
db.once("open", function () {
  console.log("Connected to Database :: MongoDB - " + process.env.DB_NAME);
});

module.exports = db;
