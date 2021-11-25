require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 *
 * @param {Number} id user.id
 * @param {String} role user.role
 * @returns {String}
 */
function generateAccessToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

/**
 *
 * @param {String} token
 * @returns {{ id: Number, role: String }}
 */
function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
