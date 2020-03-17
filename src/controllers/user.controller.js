const User = require('../models/user.model');

exports.get = (req, res) => {
  const errors = [];
  User.findById(req.params.id,
      (err, user) => {
        if (!user) {
          errors.push({'error': 'User not found'});
          res.send({errors}).status(404);
        } else {
          user.password = null;
          res.send(user).status(200);
        }
      });
};
