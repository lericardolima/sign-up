const jwt = require('jsonwebtoken');
const fs = require('file-system');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const TOKEN_EXPIRATION_TIME = 300;
const TOKEN_ALGORITHM_RS256 = 'RS256';
const SALT_RANDS = 12;

exports.register = (req, res) => {
  bcrypt.hash(req.body.password, SALT_RANDS)
      .then((encoded) => {
        req.body.password = encoded;
        return new User(req.body);
      })
      .then((newUser) => {
        newUser.save((err, user) => {
          if (err && err.name == 'MongoError' &&
                err.code == 11000 && err.keyValue.email) {
            return res.status(409)
                .send('Could not create user: Email is already in use.');
          } else if (err) {
            return res.status(500)
                .send('Something wrong happened. We\'re sorry!');
          }

          const id = user.id;
          const privateKey = fs.readFileSync('./.private.key', 'utf8');
          const token = jwt.sign({id}, privateKey, {
            expiresIn: TOKEN_EXPIRATION_TIME,
            algorithm: TOKEN_ALGORITHM_RS256,
          });

          return res.status(201).send({
            id: user.id,
            created_at: user.created_at,
            updated_at: user.updated_at,
            logged_at: user.logged_at,
            auth: true,
            token: token,
          });
        });
      });
};

exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  }, (err, user) => {
    if (!user) {
      return res.status(404).send('User not found');
    }

    bcrypt.compare(req.body.password, user.password, (error, result) => {
      if (!result) {
        return res.status(400).send('Incorrect password');
      }

      const id = user.id;
      const privateKey = fs.readFileSync('./.private.key', 'utf8');
      const token = jwt.sign({id}, privateKey, {
        expiresIn: TOKEN_EXPIRATION_TIME,
        algorithm: TOKEN_ALGORITHM_RS256,
      });

      return res.status(200).send({auth: true, token: token});
    });
  });
};

exports.authenticate = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).send({auth: false, message: 'Token not found.'});
  }

  const publicKey = fs.readFileSync('./.public.key', 'utf8');
  jwt.verify(
      token,
      publicKey,
      {algorithm: [TOKEN_ALGORITHM_RS256]},
      (err, decoded) => {
        if (err) {
          return res.status(401).send({auth: false, message: 'Invalid token.'});
        }

        next();
      });
};

