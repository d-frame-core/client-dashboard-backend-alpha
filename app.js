const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path"); // Import the path module

// Convert relative paths to absolute paths
const AdsRoute = require(path.join(__dirname, "routes", "AdsRoute"));
const FaqRoute = require(path.join(__dirname, "routes", "FaqRoute"));
const HelpRoute = require(path.join(__dirname, "routes", "HelpRoute"));
const UsersRoute = require(path.join(__dirname, "routes", "UsersRoute"));
const SurveyRoute = require(path.join(__dirname, "routes", "SurveyRoute"));
const AuthRoute = require(path.join(__dirname, "routes", "AuthRoute"));
const LearnMoreRoute = require(path.join(__dirname, "routes", "LearnMoreRoute"));
const ProfileRoute = require(path.join(__dirname, "routes", "ImageRoute"));
const BidsRoute = require(path.join(__dirname, "routes", "BidsRoute"));
const AdminRoute = require(path.join(__dirname, "routes", "AdminRoute"));
const DframeUser = require(path.join(__dirname, "routes", "DframeUser"));
const Tags = require(path.join(__dirname, "routes", "TagRoute"));

const cookieParser = require("cookie-parser");


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    frameguard: {
      action: "deny",
    },
    hidePoweredBy: true,
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true,
    hsts: {
      maxAge: 7776000,
      force: true,
    },
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// Set up routes
app.use('/ads', AdsRoute);
app.use('/users', UsersRoute);
app.use('/dframeUser', DframeUser);
app.use('/survey', SurveyRoute);
app.use('/auth', AuthRoute); 
app.use('/LearnMore', LearnMoreRoute);//admin done
app.use('/Help', HelpRoute);//admin done
app.use('/F&Q', FaqRoute);//admin done
app.use("/bids", BidsRoute)
app.use("/admin", AdminRoute)
app.use("/tag", Tags)
app.use('/uploads', express.static('uploads'), ProfileRoute);
app.use('/', (req, res) => {
  res.status(200).send('App is live');
});

module.exports = { app };
