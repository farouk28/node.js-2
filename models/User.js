const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  salt: String // Add this line
});

userSchema.methods.hashPassword = function(password, salt) {
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'ha512').toString('hex');
  return hash;
};

userSchema.methods.comparePassword = function(password) {
  const saltBuffer = Buffer.from(this.salt, 'base64'); // Retrieve the salt buffer from the User document
  const hash = crypto.pbkdf2Sync(password, saltBuffer, 1000, 64, 'ha512').toString('hex');
  return hash === this.password;
};

module.exports = mongoose.model('User', userSchema);