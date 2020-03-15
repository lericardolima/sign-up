const appController = require('../controllers/app.controller');
const userController = require('../controllers/user.controller');
const {authenticate, register, login} = require('../security/jwt.security');
const {
  userRegisterValidationRules,
  userLoginValidationRules,
  validate,
} = require('../validators/user.validator');

module.exports = (app) => {
  app.use('/api/*', authenticate);

  app.post('/register', userRegisterValidationRules(), validate, register);
  app.post('/login', userLoginValidationRules(), validate, login);

  app.get('/api/hello-world', appController.helloWorld);
  app.get('/api/users/:id', userController.get);
  app.get('*', (req, res) => res.redirect('/login'));
};

