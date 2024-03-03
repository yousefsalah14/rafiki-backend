const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { ADMIN_ROLE_ID } = require('./util');

const addAdmin = async ({ UserName, Password, Email, National_Id }) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    await User.create({
      UserName: UserName,
      Password: hashedPassword,
      Email: Email,
      National_Id: National_Id,
      Role_Id: ADMIN_ROLE_ID,
    });
  } catch (err) {
    throw err;
  }
};

const getAdmin = async (UserName) => {
  try {
    const admin = await User.findOne({
      where: {
        UserName: UserName,
        Role_Id: ADMIN_ROLE_ID,
      },
    });
    // remove password from admin object
    admin.Password = undefined;
    return admin;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  addAdmin,
  getAdmin,
};
