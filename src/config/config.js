const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname,'..', '..', `.env`) });

const commonConfig = {
	DB_USER_NAME: process.env.DB_USER_NAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_PORT: process.env.DB_PORT,
	DB_NAME: process.env.DB_NAME,
	TEMP_API_KEY: process.env.TEMP_API_KEY,
	JWT_SECRET: process.env.JWT_SECRET,
	FRONTEND_URL: process.env.FRONTEND_URL,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
	TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
	TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
};

if (process.env.NODE_ENV?.trim() != 'dev') {
	module.exports = {
		...commonConfig,
		NODE_ENV: 'prod',
		DB_HOST: process.env.DB_HOST,
		SSL: true,
	};
} else {
	module.exports = {
		...commonConfig,
		NODE_ENV: 'dev',
		DB_HOST: '127.0.0.1',
	};
}
