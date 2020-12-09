const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
});

// userSchema.methods.deleteToken = function (token, cb) {
//   var user = this;

//   user.update({ $unset: { token: 1 } }, function (err, user) {
//     if (err) return cb(err);
//     cb(null, user);
//   });
// };

module.exports = mongoose.model('User', userSchema);
