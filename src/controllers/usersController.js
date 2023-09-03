const user_util = require('../utils/user_util');
const { CLOUDINARY_API_SECRET } = require('../config/config');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'do6oz83pz',
    api_key: '524566722143567',
    api_secret: CLOUDINARY_API_SECRET,
    upload_preset: 'ggdkuker'
});

exports.addAlumni = async (req, res, next) => {
    try {
        const { UserName, Password, Email, National_Id } = req.body;
        if (!UserName || !Password || !Email || !National_Id) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        if (await user_util.checkEmailExists(Email) || await user_util.checkNationalIdExists(National_Id) || await user_util.checkUserNameExists(UserName)) {
            res.status(400).send({ success: false, message: 'Email or National Id or User Name already exists.' });
            return;
        }
        await user_util.addAlumni({ UserName, Password, Email, National_Id });
        res.status(201).send({ success: true, message: 'Alumni added successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.getAlumni = async (req, res, next) => {
    try {
        const { UserName } = req.body.session;
        const alumni = await user_util.getAlumni(UserName);
        if (!alumni) {
            res.status(404).send({ success: false, message: 'Alumni not found.' });
            return;
        }
        res.status(200).send({ success: true, alumni });
    } catch (err) {
        next(err);
    }
};

exports.addStudent = async (req, res, next) => {
    try {
        const { UserName, Password, Email, National_Id, Academic_Id } = req.body;
        if (!UserName || !Password || !Email || !National_Id || !Academic_Id) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        if (await user_util.checkEmailExists(Email) || await user_util.checkNationalIdExists(National_Id) || await user_util.checkUserNameExists(UserName)) {
            res.status(400).send({ success: false, message: 'Email or National Id or User Name already exists.' });
            return;
        }
        await user_util.addStudent({ UserName, Password, Email, National_Id, Academic_Id });
        res.status(201).send({ success: true, message: 'Student added successfully.' });
    } catch (err) {
        next(err);
    }
}

exports.getStudent = async (req, res, next) => {
    try {
        const { UserName } = req.body.session;
        const student = await user_util.getStudent(UserName);
        if (!student) {
            res.status(404).send({ success: false, message: 'Student not found.' });
            return;
        }
        res.status(200).send({ success: true, student });
    } catch (err) {
        next(err);
    }
}

exports.addHR = async (req, res, next) => {
    try {
        const { UserName, Password, Email, LastName, FirstName } = req.body;
        if (!UserName || !Password || !Email || !FirstName || !LastName) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        if (await user_util.checkEmailExists(Email) || await user_util.checkUserNameExists(UserName)) {
            res.status(400).send({ success: false, message: 'Email or National Id or User Name already exists.' });
            return;
        }
        await user_util.addHR({ UserName, Password, Email, FirstName, LastName });
        res.status(201).send({ success: true, message: 'HR added successfully.' });
    } catch (err) {
        next(err);
    }
}

exports.getHR = async (req, res, next) => {
    try {
        const { UserName } = req.body.session;
        const hr = await user_util.getHR(UserName);
        if (!hr) {
            res.status(404).send({ success: false, message: 'HR not found.' });
            return;
        }
        res.status(200).send({ success: true, hr });
    } catch (err) {
        next(err);
    }
}

exports.getFullUser = async (req, res, next) => {
    try {
        const { UserName } = req.body.session;
        const user = await user_util.getUser(UserName);
        if (!user) {
            res.status(404).send({ success: false, message: 'User not found.' });
            return;
        }
        res.status(200).send({ success: true, user });
    } catch (err) {
        next(err);
    }
}

exports.checkNationalIdExists = async (req, res, next) => {
    try {
        const { NID } = req.body;
        if (!NID) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        const exists = await user_util.checkNationalIdExists(NID);
        if (exists) {
            res.status(200).send({ success: false, message: 'National Id exists please try another one..' });
        }
        else {
            res.status(404).send({ success: true, message: 'National Id does not exist.' });
        }
    } catch (err) {
        next(err);
    }
}

exports.checkEmailExists = async (req, res, next) => {
    try {
        const { Email } = req.body;
        if (!Email) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        const exists = await user_util.checkEmailExists(Email);
        if (exists) {
            res.status(200).send({ success: false, message: 'Email already exists please try another one.' });
        }
        else {
            res.status(404).send({ success: true, message: 'Email does not exist.' });
        }
    } catch (err) {
        next(err);
    }
}

exports.checkUserNameExists = async (req, res, next) => {
    try {
        const { UserName } = req.body;
        if (!UserName) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        const exists = await user_util.checkUserNameExists(UserName);
        if (exists) {
            res.status(200).send({ success: false, message: 'User Name already exists please try another one.' });
        }
        else {
            res.status(404).send({ success: true, message: 'User Name does not exist.' });
        }
    } catch (err) {
        next(err);
    }
}

exports.checkAcademicIdExists = async (req, res, next) => {
    try {
        const { Academic_Id } = req.body;
        if (!Academic_Id) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        const exists = await user_util.checkAcademicIdExists(Academic_Id);
        if (exists) {
            res.status(200).send({ success: false, message: 'Academic Id exists please try another one..' });
        }
        else {
            res.status(200).send({ success: true, message: 'Academic Id does not exist.' });
        }
    } catch (err) {
        next(err);
    }
}

exports.updatePhone = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        const { Phone } = req.body;
        if (!Phone) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        await user_util.updatePhone(User_Id, Phone);
        res.status(200).send({ success: true, message: 'Phone updated successfully.' });
    } catch (err) {
        if (err.message === 'Phone already exists') {
            res.status(409).send({ success: false, message: 'Phone already exists.' });
            return;
        }
        next(err);
    }
};

exports.uploadProfilePicture = async (req, res, next) => {
    try {
        const { User_Id, UserName } = req.body.session;
        const { pictureUrl } = req.body;
        const user = await user_util.getUser(UserName);
        if (!user) {
            res.status(404).send({ success: false, message: 'User not found.' });
            return;
        }
        // delete old picture from cloudinary if exists
        if (user.Img) {
            const public_id = "images/" + user.Img.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(public_id);
        }
        await user_util.uploadPicture(User_Id, pictureUrl);
        res.status(200).send({ success: true, message: 'Picture uploaded successfully.', Img: pictureUrl })
    } catch (err) {
        next(err);
    }
};

exports.uploadCV = async (req, res, next) => {
    try {
        const { User_Id, UserName } = req.body.session;
        const { cvUrl } = req.body;
        if (!cvUrl) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        const user = await user_util.getUser(UserName);
        if (!user) {
            res.status(404).send({ success: false, message: 'User not found.' });
            return;
        }
        // delete old cv from cloudinary if exists
        if (user.CV) {
            const public_id = "cvs/" + user.CV.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(public_id);
        }
        await user_util.uploadCV(User_Id, cvUrl);
        res.status(200).send({ success: true, message: 'CV uploaded successfully.', CV: cvUrl }).end();
    } catch (err) {
        next(err);
    }
};

exports.updateAbout = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        const { About } = req.body;
        if (!About) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        await user_util.updateAbout(User_Id, About);
        res.status(200).send({ success: true, message: 'About updated successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.updateCountry = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        const { Country } = req.body;
        if (!Country) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        await user_util.updateCountry(User_Id, Country);
        res.status(200).send({ success: true, message: 'Country updated successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.updateSocialUrls = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        const { Behance_URL, LinkedIn_URL, GitHub_URL } = req.body;
        let data = {};
        if (Behance_URL) {
            data.Behance_URL = Behance_URL;
        }
        if (LinkedIn_URL) {
            data.LinkedIn_URL = LinkedIn_URL;
        }
        if (GitHub_URL) {
            data.GitHub_URL = GitHub_URL;
        }
        if (Object.keys(data).length === 0) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        await user_util.updateSocialUrls(User_Id, data);
        res.status(200).send({ success: true, message: 'Social URLs updated successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.updateName = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        const { FirstName, LastName } = req.body;
        if (!FirstName || !LastName) {
            res.status(400).send({ success: false, message: 'Missing credentials.' });
            return;
        }
        await user_util.updateName(User_Id, { FirstName, LastName });
        res.status(200).send({ success: true, message: 'Name updated successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.deleteProfilePicture = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        await user_util.deleteProfilePicture(User_Id);
        res.status(200).send({ success: true, message: 'Profile picture deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.deleteCV = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        await user_util.deleteCV(User_Id);
        res.status(200).send({ success: true, message: 'CV deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.deleteBehanceUrl = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        await user_util.deleteBehance_URL(User_Id);
        res.status(200).send({ success: true, message: 'Behance URL deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.deleteGitHubUrl = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        await user_util.deleteGitHub_URL(User_Id);
        res.status(200).send({ success: true, message: 'GitHub URL deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.deleteLinkedInUrl = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        await user_util.deleteLinkedIn_URL(User_Id);
        res.status(200).send({ success: true, message: 'LinkedIn URL deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.deleteAbout = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        await user_util.deleteAbout(User_Id);
        res.status(200).send({ success: true, message: 'About deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.deletePhone = async (req, res, next) => {
    try {
        const { User_Id } = req.body.session;
        await user_util.deletePhone(User_Id);
        res.status(200).send({ success: true, message: 'Phone deleted successfully.' });
    } catch (err) {
        next(err);
    }
};
