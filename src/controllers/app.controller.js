const HelloWorld = require('../models/hello-world.model');

exports.helloWorld = (req, res) => {
  HelloWorld.findOne({message: 'Hello world!!'}, (err, helloWorld) => {
    if (!helloWorld) {
      res.send('Task not found').status(404);
    } else {
      res.send(helloWorld.message).status(200);
    }
  });
};
