/**
 * Middleware function for authorization
 * @param {string[]} roleNames - An array of role names that are authorized to access the route
 * @returns {Function} - A middleware function that checks if the user is authorized to access the route
 */
const checkAuthorization = (roleNames) => (req, res, next) => {
    const sessionId = req.headers.authorization.split(' ')[1];
    req.sessionStore.get(sessionId, (err, session) => {
        if (err) {
            console.log("session err", err);
            res.status(500).send({ success: false, message: 'Internal Server Error.' });
        } else {
            if (session?.IsLoggedIn && roleNames.includes(session?.RoleName)) {
                req.body.session = session;
                req.body.sessionId = sessionId;
                next();
            } else {
                res.status(401).send({ success: false, message: 'Unauthorized.' });
            }
        }
    });
};

/**
 * Middleware functions for specific roles
 */
const isAlumni = checkAuthorization(["Alumni"]);
const isAdmin = checkAuthorization(["Admin"]);
const isStudent = checkAuthorization(["Student"]);
const isHR = checkAuthorization(["HR"]);
const isAuthorized = checkAuthorization(["Alumni", "Admin", "Student", "HR", "Professor"]);
const isAlumniOrStudent = checkAuthorization(["Alumni", "Student"]);
const isProfessor = checkAuthorization(["Professor"]);

module.exports = {
    isAlumni,
    isAdmin,
    isStudent,
    isHR,
    isAuthorized,
    isAlumniOrStudent,
    isProfessor,
    checkAuthorization
};
