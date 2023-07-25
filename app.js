const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const AdsRoute = require('./routes/AdsRoute');
const FaqRoute = require('./routes/FaqRoute');
const HelpRoute = require('./routes/HelpRoute');
const UsersRoute = require('./routes/UsersRoute');
const SurveyRoute = require('./routes/SurveyRoute');
const AuthRoute = require('./routes/AuthRoute');
const LearnMoreRoute = require('./routes/LearnMoreRoute');
const ProfileRoute = require('./routes/ImageRoute');
const BidsRoute = require('./routes/BidsRoute')
const AdminRoute = require('./routes/AdminRoute')
const DframeUser = require('./routes/DframeUser')
const path = require('path');

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(express.json());
app.use(
  helmet({
    frameguard: {
      action: 'deny',
    },
    hidePoweredBy: true,
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true,
    hsts: {
      maxAge: 7776000,
      force: true,
    },
  }),
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
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
app.use('/uploads', express.static('uploads'), ProfileRoute);

module.exports = { app };
