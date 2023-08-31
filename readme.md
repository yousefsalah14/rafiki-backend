# Alumni Management System

This is a web application that allows alumni to register for an account and upload their profile picture and CV. They can also view their profile and edit their information if necessary.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Set up the environment variables by creating a `.env` file in the root directory and adding the following variables:
    - DB_HOST=<database host>
    - DB_USER_NAME=<database user>
    - DB_PASSWORD=<database password>
    - DB_NAME=<database name>
    - DB_PORT=<database port>
    - SESSION_SECRET=<session secret>
    - CLOUDINARY_API_SECRET=<Cloudinary API secret>
    - JWT_SECRET=<JWT secret>
    - FRONTEND_URL=<frontend URL>

4. Start the server by running `npm run dev`.
5. Open your web browser and navigate to `http://localhost:3008`.
6. Register for an account or log in if you already have an account.
7. Upload a profile picture and CV.
8. View your profile and edit your information if necessary.

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