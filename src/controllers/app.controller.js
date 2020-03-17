const HelloWorld = require('../models/hello-world.model');

exports.helloWorld = (req, res) => {
  const errors = [];
  HelloWorld.findOne({'message': 'Hello world!!'},
      (err, helloWorld) => {
        if (!helloWorld) {
          errors.push({'message': 'Task not found'});
          res.send({errors}).status(404);
        } else {
          res.send({message: helloWorld.message}).status(200);
        }
      });
};
