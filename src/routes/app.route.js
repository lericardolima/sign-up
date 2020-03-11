const appController = require('../controllers/app.controller');

module.exports = (app) => {
  app.route('/api/hello-world')
      .get(appController.helloWorld);

  app.route('*')
      .get((req, res) => res.redirect('/api/hello-world'));
};
