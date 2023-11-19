/** @format */

const mongoose = require('mongoose');
const path = require('path');
const { app } = require(path.join(__dirname, 'app'));
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const start = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.CONNECTIONSTRING);
    console.log('Db Connected');
  } catch (err) {
    console.error(err);
  }
  app.listen(PORT, () => {
    console.log('App Started at port', PORT);
  });
};

start();
