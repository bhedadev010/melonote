const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
