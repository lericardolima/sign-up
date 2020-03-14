const appController = require('../controllers/app.controller');
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
  app.get('*', (req, res) => res.redirect('/login'));
};
