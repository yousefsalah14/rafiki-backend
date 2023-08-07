// Middleware function for authorization
const checkAuthorization = (roleNames) => (req, res, next) => {
    const sessionId = req.headers.authorization.split(' ')[1];
    req.sessionStore.get(sessionId, (err, session) => {
        if (err) {
            console.log("session err", err);
            res.status(500).send({ success: false, message: 'Internal Server Error.' });
        } else {
            if (session?.IsLoggedIn && roleNames.includes(session?.RoleName)) {
                req.session.User_Id = session.User_Id;
                req.session.RoleName = session.RoleName;
                req.session.IsLoggedIn = session.IsLoggedIn;
                req.session.UserName = session.UserName;
                req.body.sessionId = sessionId;
                next();
            } else {
                res.status(401).send({ success: false, message: 'Unauthorized.' });
            }
        }
    });
};

// Middleware functions for specific roles
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
    isProfessor
};
