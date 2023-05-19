const express = require("express");
const app = express();

require('dotenv').config();
// requiring mongoose library to be able to perform operations on mongoDB
require("./config/mongoose");


// defining PORT to run my express server
const PORT = process.env.PORT || 5000;


//parse both application/json and  raw text
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(express.json({ type: "application/json" }));

//use express router
app.use("/", require("./routes"));

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//server running on port 8040
app.listen(PORT, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on PORT : ${PORT}..........`);
});
