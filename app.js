const express = require('express');
const PORT = process.env.PORT || 3008;
const db = require('./src/config/db_config');
const app = express();
const util = require('./src/utils/util');
const cors = require('cors');
const session = require('express-session');
const { checkRoles } = require('./src/utils/role_util');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

db.authenticate()
	.then(() => {
		console.log('\x1b[32m', 'Database connection has been established successfully.');
	})
	.catch((err) => {
		console.error('\x1b[31m', 'Unable to connect to the database:', err);
	});

util
	.syncTables()
	.then(() => {
		console.log('\x1b[34m%s\x1b[0m', 'Tables synced successfully.');
	})
	.then(() => {
		checkRoles()
			.then(() => {
				console.log('\x1b[34m%s\x1b[0m', 'Roles checked successfully.');
			})
			.catch((err) => {
				console.log('\x1b[31m', 'Error checking roles:');
				console.error('\x1b[31m', err);
			});
	})
	.catch((err) => {
		console.log('\x1b[31m', 'Error syncing tables:');
		console.error('\x1b[31m', err);
	});

function extendDefaultFields(defaults, session) {
	return {
		data: defaults.data,
		expires: defaults.expires,
		User_Id: session.User_Id,
	};
}

const sessionStore = new SequelizeStore({
	db: db,
	modelKey: 'Session',
	table: 'Session',
	checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
	// Default is 1 week
	expiration: 7 * 24 * 60 * 60 * 1000, // The maximum age (in milliseconds) of a valid session.
	extendDefaultFields: extendDefaultFields,
});
sessionStore.sync();
// Set middleware for sessions
app.use(
	session({
		secret: 'a very strong secret',
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
			httpOnly: false,
			secure: false,
		},
	})
);
// Set middleware for proxy
app.set('trust proxy', true);
// Set middleware for CORS
app.use(cors());
// Set middleware for security
app.use(helmet());
// Set middleware for logging
const format =
	':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(
	morgan(format, {
		skip: function (req, res) {
			return res.statusCode < 400;
		},
		stream: accessLogStream,
	})
);
// Set middleware for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Set middleware for serving static files
app.use(express.static('public'));

app.listen(PORT, () => {
	console.log('\x1b[1m', `Server listening on: http://localhost:${PORT}`);
});

const authLimiter = util.createLimiter(1000 * 60, 15); //? 1 minute window, max 15 requests

// Routes
app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/auth', authLimiter, require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/roles', require('./src/routes/roles'));
app.use('/api/skills', require('./src/routes/skills'));
app.use('/api/user_skills', require('./src/routes/user_skills'));
app.use('/api/jobs', require('./src/routes/jobs'));
app.use('/', require('./src/routes/access-codes'));

// 404 middleware
app.use((req, res, next) => {
	res.status(404).send('Sorry cant find that!');
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error('\x1b[31m', err);
	if (err.isOperational) {
		res.status(err.statusCode).json({ success: false, message: err.message, error: err });
	}else{
		res.status(500).send("Internal Server Error");
	}
});

module.exports = app; // Exporting for testing purposes
