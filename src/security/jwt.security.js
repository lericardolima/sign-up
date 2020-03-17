const jwt = require('jsonwebtoken');
const fs = require('file-system');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

const TOKEN_EXPIRATION_TIME = 300;
const TOKEN_ALGORITHM = 'RS256';
const SALT_RANDS = 12;

exports.register = (req, res) => {
  const errors = [];
  bcrypt.hash(req.body.password, SALT_RANDS)
      .then((encoded) => {
        req.body.password = encoded;
        return new User(req.body);
      })
      .then((newUser) => {
        newUser.save((err, user) => {
          if (err && err.name == 'MongoError' &&
                err.code == 11000 && err.keyValue.email) {
            errors.push({'error': 'Email is already in use'});
            return res.status(409).send({errors});
          } else if (err) {
            errors.push({'error': 'Something wrong happened. We\'re sorry!'});
            return res.status(500).send({errors});
          }

          const token = this.genToken(user.id);
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
  const errors = [];
  User.findOne({
    email: req.body.email,
  }, (err, user) => {
    if (!user) {
      errors.push({'error': 'User not found'});
      return res.status(404).send({errors});
    }

    bcrypt.compare(req.body.password, user.password, (error, result) => {
      if (!result) {
        errors.push({'error': 'Incorrect password'});
        return res.status(400).send({errors});
      }

      const token = this.genToken(user.id);
      return res.status(200).send({auth: true, token: token});
    });
  });
};

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({auth: false, message: 'Token not found.'});
  }

  const publicKey = fs.readFileSync('./.public.key', 'utf8');
  jwt.verify(
      token.substring(7),
      publicKey,
      {algorithm: [TOKEN_ALGORITHM]},
      (err, decoded) => {
        if (err) {
          return res.status(401).send({auth: false, message: 'Invalid token.'});
        }

        next();
      });
};

exports.genToken = (id) => {
  const privateKey = fs.readFileSync('./.private.key', 'utf8');
  const token = jwt.sign({id: id}, privateKey, {
    expiresIn: TOKEN_EXPIRATION_TIME,
    algorithm: TOKEN_ALGORITHM,
  });

  return `Bearer ${token}`;
};
