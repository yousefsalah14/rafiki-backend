const TEMP_API_KEY = process.env.TEMP_API_KEY;

module.exports = isAdmin = (req, res, next) => {
  if (req.headers['admin-api-key'] !== TEMP_API_KEY) {
    res.status(401).send({ success: false, message: 'Unauthorized.' });
    return;
  }
  next();
};
