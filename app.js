const express = require('express');
const helmet = require('helmet');
const AdsRoute = require('./routes/AdsRoute')
const UsersRoute = require('./routes/UsersRoute')
const BidsRoute = require('./routes/BidsRoute')

const app = express();
app.use(express.urlencoded({extended: false}));
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

app.use("/ads", AdsRoute)

app.use("/users", UsersRoute)

app.use("/bids", BidsRoute)

app.use('/images', express.static('uploads'));

module.exports = { app };
