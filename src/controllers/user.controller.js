const User = require('../models/user.model');

exports.get = (req, res) => {
  User.findById(req.params.id,
      (err, user) => {
        if (!user) {
          res.send('User not found').status(404);
        } else {
          user.password = null;
          res.send(user).status(200);
        }
      });
};
