/** @format */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); // Import the path module

// Convert relative paths to absolute paths
const AdsRoute = require(path.join(__dirname, 'src', 'routes', 'AdsRoute'));
const FaqRoute = require(path.join(__dirname, 'src', 'routes', 'FaqRoute'));
const HelpRoute = require(path.join(__dirname, 'src', 'routes', 'HelpRoute'));
const UsersRoute = require(path.join(__dirname, 'src', 'routes', 'UsersRoute'));
const TransactionRouter = require(path.join(
  __dirname,
  'src',
  'routes',
  'TransactionRoute'
));
const SurveyRoute = require(path.join(
  __dirname,
  'src',
  'routes',
  'SurveyRoute'
));
const AuthRoute = require(path.join(__dirname, 'src', 'routes', 'AuthRoute'));
const WebsiteRoute = require(path.join(__dirname, 'src', 'routes', 'Website'));
const LearnMoreRoute = require(path.join(
  __dirname,
  'src',
  'routes',
  'LearnMoreRoute'
));
const ProfileRoute = require(path.join(
  __dirname,
  'src',
  'routes',
  'ImageRoute'
));
const BidsRoute = require(path.join(__dirname, 'src', 'routes', 'BidsRoute'));
const AdminRoute = require(path.join(__dirname, 'src', 'routes', 'AdminRoute'));
const DframeUser = require(path.join(__dirname, 'src', 'routes', 'DframeUser'));
const Tags = require(path.join(__dirname, 'src', 'routes', 'TagRoute'));

const cookieParser = require('cookie-parser');
const { WalletRouter } = require('./src/routes/wallet.route');
const { CronJob } = require('./src/routes/cron');
const { RewardRequestRouter } = require('./src/routes/RewardRoute');
const { UserInfo } = require('./src/routes/Info');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(cookieParser());
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
  })
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

// Set up routes
app.use('/ads', AdsRoute);
app.use('/users', UsersRoute);
app.use('/dframeUser', DframeUser);
app.use('/survey', SurveyRoute);
app.use('/auth', AuthRoute);
app.use('/LearnMore', LearnMoreRoute); //admin done
app.use('/Help', HelpRoute); //admin done
app.use('/F&Q', FaqRoute); //admin done
app.use('/bids', BidsRoute);
app.use('/admin', AdminRoute);
app.use('/tags', Tags);
app.use('/uploads', express.static('uploads'), ProfileRoute);
app.use('/wallet', WalletRouter);
app.use('/websites', WebsiteRoute);
app.use('/cron', CronJob);
app.use('/transaction', TransactionRouter);
app.use('/rewards', RewardRequestRouter);
app.use('/userinfo', UserInfo);
app.use('/', (req, res) => {
  res.status(200).send('App is live');
});

module.exports = { app };
