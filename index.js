const mongoose = require("mongoose");
const path = require("path"); 
const { app } = require(path.join(__dirname, "app"));
require("dotenv").config();

const start = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.CONNECTIONSTRING);
    console.log("Db Connected");
  } catch (err) {
    console.error(err);
  }
  app.listen(8080, () => {
    console.log("App Started");
  });
};

start();
