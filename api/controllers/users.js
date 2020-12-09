const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi');

const User = require('../models/user');

const saltRounds = 10;

// Just for development.
exports.getAllUsers = (req, res, next) => {
  User.find()
    .exec()
    .then((users) => {
      res.status(200).json({
        users: users,
      });
    })
    .catch();
};

const schema = joi.object({
  email: joi.string().min(10).required().email(),
  password: joi.string().min(6).required(),
});

exports.userSignup = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(409).json({
      message: 'Email already exists.',
    });

  await bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const user = User({
        _id: mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
      });

      try {
        const savedUser = await user.save();
        res.status(201).json({
          message: 'User Created.',
          response: savedUser,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
      }
    }
  });
};

exports.userLogin = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(401).json({ message: 'Invalied email or password' });

  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }

    if (result) {
      const accessToken = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h',
        }
      );
      const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_KEY, {
        expiresIn: '1y',
      });

      return res.status(200).json({
        message: 'Auth Successful.',
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
    // 401 is authorization has been refused. Because we don't wnat to give specific information
    // whether it is the password or the email.
    res.status(401).json({
      message: 'Auth Failed. Invalied email or password',
    });
  });
};

exports.userLogout = (req, res, next) => {
  console.log('logout: ', req.userData);
  res.status(200).json({
    message: 'Successfuly loged out.',
  });
};

exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.deleteOne({ _id: req.params.userId });

    if (deletedUser.n === 0)
      return res.status(400).json({ message: 'Bad Request' });

    res.status(202).json({
      message: 'User successfuly deleted.',
    });
  } catch {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
