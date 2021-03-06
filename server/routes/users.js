// Require the user handler
// We will use the handler to process data passed into our routers
var User = require('../controllers/user');

module.exports = function(app, express) {
  var router = express.Router();

  router.route('/users/login')
    .post(User.login);

  router.route('/users/logout')
    .post(User.logout);
  router.route('/users')
    .post(User.signup);
  // verify user middleware
  router.use(User.verifyUser);

  router.route('/users')
    .get(User.all);

  router.route('/users/:id')
    .get(User.find)
    .put(User.update)
    .delete(User.delete);

  router.route('/users/:id/documents')
    .get(User.findById);
  router.route('/session')
    .get(function(req, res) {
      res.send(req.decoded);
    });

  // All the api should start with prefix api
  app.use('/api', router);
};
