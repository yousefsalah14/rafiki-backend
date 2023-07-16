
// verify session
const isAlumni = (req, res, next) => {
    //get the sessionId from the authorization header Barer <sessionId>
    const sessionId = req.headers.authorization.split(' ')[1];
    //get the session from the session store 
    req.sessionStore.get(sessionId, (err, session) => {
        if (err) {
            console.log("session err", err);
            res.status(500).send({ success: false, message: 'Internal Server Error.' });
        } else {
            if (session.RoleName === "Alumni" && session.IsLoggedIn) {
                req.session.User_Id = session.User_Id;
                req.session.RoleName = session.RoleName;
                req.session.IsLoggedIn = session.IsLoggedIn;
                req.session.UserName = session.UserName;
                next();
            } else {
                res.status(401).send({ success: false, message: 'Unauthorized.' });
            }
        }
    });
}

const isAdmin = (req, res, next) => {
    const sessionId = req.headers.authorization.split(' ')[1];
    req.sessionStore.get(sessionId, (err, session) => {
        if (err) {
            console.log("session err", err);
            res.status(500).send({ success: false, message: 'Internal Server Error.' });
        } else {
            if (session.RoleName === "Admin" && session.IsLoggedIn) {
                req.session.User_Id = session.User_Id;
                req.session.RoleName = session.RoleName;
                req.session.IsLoggedIn = session.IsLoggedIn;
                req.session.UserName = session.UserName;
                next();
            } else {
                res.status(401).send({ success: false, message: 'Unauthorized.' });
            }
        }
    }
    );
}

const isStudent = (req, res, next) => {
    const sessionId = req.headers.authorization.split(' ')[1];
    req.sessionStore.get(sessionId, (err, session) => {
        if (err) {
            console.log("session err", err);
            res.status(500).send({ success: false, message: 'Internal Server Error.' });
        } else {
            if (session.RoleName === "Student" && session.IsLoggedIn) {
                req.session.User_Id = session.User_Id;
                req.session.RoleName = session.RoleName;
                req.session.IsLoggedIn = session.IsLoggedIn;
                req.session.UserName = session.UserName;
                next();
            } else {
                res.status(401).send({ success: false, message: 'Unauthorized.' });
            }
        }
    }
    );
}

const isHR = (req, res, next) => {
    const sessionId = req.headers.authorization.split(' ')[1];
    req.sessionStore.get(sessionId, (err, session) => {
        if (err) {
            console.log("session err", err);
            res.status(500).send({ success: false, message: 'Internal Server Error.' });
        } else {
            if (session.RoleName === "HR" && session.IsLoggedIn) {
                req.session.User_Id = session.User_Id;
                req.session.RoleName = session.RoleName;
                req.session.IsLoggedIn = session.IsLoggedIn;
                req.session.UserName = session.UserName;
                next();
            } else {
                res.status(401).send({ success: false, message: 'Unauthorized.' });
            }
        }
    }
    );
}

const isAuthorized = (req, res, next) => {
    const sessionId = req.headers.authorization.split(' ')[1];
    req.sessionStore.get(sessionId, (err, session) => {
        if (err) {
            console.log("session err", err);
            res.status(500).send({ success: false, message: 'Internal Server Error.' });
        } else {
            if (session.IsLoggedIn) {
                req.session.User_Id = session.User_Id;
                req.session.RoleName = session.RoleName;
                req.session.IsLoggedIn = session.IsLoggedIn;
                req.session.UserName = session.UserName;
                next();
            } else {
                res.status(401).send({ success: false, message: 'Unauthorized.' });
            }
        }
    }
    );

}

module.exports = {
    isAlumni,
    isAdmin,
    isStudent,
    isHR,
    isAuthorized
}
