const User = require("../models/User");
const Role = require("../models/Role");
const Users_Skills = require("../models/Users_Skills");
const Skills = require("../models/Skill");
const bcrypt = require("bcryptjs");
const path = require('path');
const fs = require('fs');
const { encode } = require('blurhash');
const sharp = require('sharp');
const { ADMIN_ROLE_ID, ALUMNI_ROLE_ID, STUDENT_ROLE_ID, HR_ROLE_ID, PROFESSOR_ROLE_ID } = require('./util');


const addAlumni = async ({ UserName, Password, Email, National_Id }) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        await User.create({
            UserName: UserName,
            Password: hashedPassword,
            Email: Email,
            National_Id: National_Id,
            Role_Id: ALUMNI_ROLE_ID
        });
    } catch (err) {
        throw err;
    }
}

const getAlumni = async (UserName) => {
    try {
        const alumni = await User.findOne({
            where: {
                UserName: UserName,
                Role_Id: ALUMNI_ROLE_ID
            }
        });
        alumni.Password = undefined;
        return alumni;
    } catch (err) {
        throw err;
    }
}

const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (err) {
        throw err;
    }
}

const updatePhone = async (User_Id, Phone) => {
    try {
        // ensure that the phone is unique it's unique in the model already
        const user = await User.findOne({ where: { Phone } });
        if (user !== null && user.User_Id !== User_Id) {
            throw new Error("Phone already exists");
        }
        await User.update({
            Phone: Phone
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

//check email existence
async function checkEmailExists(email) {
    const user = await User.findOne({ where: { email } });
    return user !== null;
}

// check National Id existence
async function checkNationalIdExists(National_Id) {
    const user = await User.findOne({ where: { National_Id } });
    return user !== null;
}

// UserName existence
async function checkUserNameExists(UserName) {
    const user = await User.findOne({ where: { UserName } });
    return user !== null;
}

const addStudent = async ({ UserName, Password, Email, National_Id, Academic_Id }) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        await User.create({
            UserName: UserName,
            Password: hashedPassword,
            Email: Email,
            National_Id: National_Id,
            Academic_Id: Academic_Id,
            Role_Id: STUDENT_ROLE_ID
        });
    } catch (err) {
        throw err;
    }
}

const getStudent = async (UserName) => {
    try {
        const student = await User.findOne({
            where: {
                UserName: UserName,
                Role_Id: STUDENT_ROLE_ID
            }
        });
        student.Password = undefined;
        return student;
    } catch (err) {
        throw err;
    }
}

const addHR = async ({ UserName, Password, Email, FirstName, LastName }) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        await User.create({
            UserName: UserName,
            Password: hashedPassword,
            Email: Email,
            FirstName: FirstName,
            LastName: LastName,
            Role_Id: HR_ROLE_ID
        });
    } catch (err) {
        throw err;
    }
}

const getHR = async (UserName) => {
    try {
        const hr = await User.findOne({
            where: {
                UserName: UserName,
                Role_Id: HR_ROLE_ID
            }
        });
        hr.Password = undefined;
        return hr;
    } catch (err) {
        throw err;
    }
}

const uploadPicture = async (User_Id, Img) => {
    try {
        await User.update({
            Img: Img
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const uploadCV = async (User_Id, CV) => {
    try {
        await User.update({
            CV: CV
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const updateAbout = async (User_Id, About) => {
    try {
        await User.update({
            About: About
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const updateCountry = async (User_Id, Country) => {
    try {
        await User.update({
            Country: Country
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const updateSocialUrls = async (User_Id, socialUrls = {
    Behance_URL: "",
    LinkedIn_URL: "",
    GitHub_URL: ""
}) => {
    let defaultObject = {
        Behance_URL: null,
        LinkedIn_URL: null,
        GitHub_URL: null
    }
    // merge the two objects
    let merged = { ...defaultObject, ...socialUrls };
    try {
        await User.update({
            Behance_URL: merged.Behance_URL,
            LinkedIn_URL: merged.LinkedIn_URL,
            GitHub_URL: merged.GitHub_URL
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const updateName = async (User_Id, { FirstName, LastName }) => {
    try {
        await User.update({
            FirstName: FirstName,
            LastName: LastName
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const getUser = async (UserName) => {
    try {
        const user = await User.findOne({
            where: {
                UserName: UserName
            },
            include: [
                {
                    model: Role,
                    attributes: ['Role_Name'],
                    raw: true
                },
                {
                    model: Skills,
                    as: 'UserSkills',
                    attributes: ['Skill_Name'],
                    through: {
                        model: Users_Skills,
                        attributes: ['Rate']
                    },
                    raw: true
                }
            ],
        });

        if (!user) {
            return null;
        }
        const dataValues = user.dataValues;
        dataValues.UserSkills = dataValues.UserSkills.map(skill => {
            return {
                Skill_Name: skill.Skill_Name,
                Rate: skill.Users_Skills.Rate
            }
        });

        return dataValues;
    } catch (err) {
        throw err;
    }
}


const checkAcademicIdExists = async (Academic_Id) => {
    try {
        const user = await User.findOne({ where: { Academic_Id } });
        return user !== null;
    } catch (error) {
        throw error;
    }
}

const deletePictureFile = async (fileName) => {
    try {
        const filePath = path.join(__dirname, '..', "..", 'public', 'uploads', 'pictures', fileName);
        if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);
    } catch (err) {
        throw err;
    }
}

const deleteCVFile = async (fileName) => {
    try {
        const filePath = path.join(__dirname, '..', "..", 'public', 'uploads', 'cvs', fileName);
        if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);
    } catch (err) {
        throw err;
    }
}

const deleteProfilePicture = async (User_Id) => {
    try {
        await User.findOne({
            where: {
                User_Id: User_Id
            }
        }).then(user => {
            if (user?.Img !== null) {
                deletePictureFile(user.Img);
                user.Img = null;
                user.save();
            }
        }).catch(err => {
            throw err;
        });

    } catch (err) {
        throw err;
    }

}

const deleteCV = async (User_Id) => {
    try {
        await User.findOne({
            where: {
                User_Id: User_Id
            }
        }).then(user => {
            if (user?.CV !== null) {
                deleteCVFile(user.CV);
                user.CV = null;
                user.save();
            }
        }).catch(err => {
            throw err;
        });
    } catch (err) {
        throw err;
    }
}

const deleteAbout = async (User_Id) => {
    try {
        await User.update({
            About: null
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const deletePhone = async (User_Id) => {
    try {
        await User.update({
            Phone: null
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const deleteLinkedIn_URL = async (User_Id) => {
    try {
        await User.update({
            LinkedIn_URL: null
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const deleteBehance_URL = async (User_Id) => {
    try {
        await User.update({
            Behance_URL: null
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const deleteGitHub_URL = async (User_Id) => {
    try {
        await User.update({
            GitHub_URL: null
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

const uploadPictureThumbnail = async (User_Id, ImgThumbnail) => {
    try {
        await User.update({
            ImgThumbnail: ImgThumbnail
        }, {
            where: {
                User_Id: User_Id
            }
        });
    } catch (err) {
        throw err;
    }
}

async function processBlurhash(filePath, User_Id) {
    try {
        const imageBuffer = await sharp(filePath).toBuffer();
        const { width, height } = await sharp(imageBuffer).metadata();
        const rgbaPixels = await sharp(imageBuffer)
            .ensureAlpha()
            .raw()
            .toBuffer();
        const hash = encode(rgbaPixels, width, height, 4, 4);
        uploadPictureThumbnail(User_Id, hash);
    } catch (error) {
        console.log(error);
        throw error;
    }
}


//TODO: add professor


// export the functions

module.exports = {
    addAlumni,
    getAlumni,
    comparePassword,
    updatePhone,
    checkEmailExists,
    checkNationalIdExists,
    checkUserNameExists,
    addStudent,
    getStudent,
    addHR,
    getHR,
    uploadPicture,
    updateAbout,
    updateCountry,
    updateSocialUrls,
    getUser,
    checkAcademicIdExists,
    deleteProfilePicture,
    deleteAbout,
    deleteBehance_URL,
    deleteGitHub_URL,
    deleteLinkedIn_URL,
    deletePhone,
    uploadCV,
    deleteCV,
    uploadPictureThumbnail,
    processBlurhash,
    updateName
}