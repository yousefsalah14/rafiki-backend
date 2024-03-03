# Alumni Management System

This is a Backend API for an Alumni Management System. It is built using Node.js, Express, Sequelize, MySQL, Cloudinary, and Multer.

## Table of Contents

- [Installation](#installation)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
- [Built With](#built-with)
- [Author](#author)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Installation

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Set up the environment variables by creating a `.env` file in the root directory and adding the following variables:

   - DB_HOST=<database host>
   - DB_USER_NAME=<database user>
   - DB_PASSWORD=<database password>
   - DB_NAME=<database name>
   - DB_PORT=<database port>
   - DEV_DB_PASSWORD = <database password>
   - DEV_DB_USER_NAME = <database name>
   - SESSION_SECRET=<session secret>
   - CLOUDINARY_API_SECRET=<Cloudinary API secret>
   - JWT_SECRET=<JWT secret>
   - FRONTEND_URL=<frontend URL>

4. Make sure you have installed docker and docker-compose in your system.
5. Run `docker-compose up` to start the MySQL server.
6. Start the server by running `npm run dev`.
7. Open your web browser and navigate to `http://localhost:3008`.

<!-- use postman collection to access api -->

## API Documentation

Use postman collection to access API. under the `postman` directory.

### Authentication

Used `express-session` and `JWT` for authentication.

## Built With

- Node.js
- Express
- Sequelize
- MySQL
- Cloudinary
- Multer

## Author

- Mazin Islam - [Github](https://github.com/N1ghtHunter) - [Linkedin](https://www.linkedin.com/in/mazin-islam-88658b22b/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc.
