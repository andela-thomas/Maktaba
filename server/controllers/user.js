(function() {  'use strict';  var env = process.env.NODE_ENV || 'development';  var User = require('../models/user'),    Doc = require('../models/document'),    bcrypt = require('bcrypt-nodejs'),    config = require('../config')[env],    jwt = require('jsonwebtoken');  var createToken = function(user) {    var token = jwt.sign({      _id: user._id,      username: user.username,      email: user.email    }, config.secretKey, {      expiresInMinute: 1440    });    return token;  };  module.exports = {    // sign up    // create user    signup: function(req, res) {      // Hash the password before we store it into the database      var hash = bcrypt.hashSync(req.body.password);      User.create({        username: req.body.username,        name: {          first: req.body.firstname,          last: req.body.lastname        },        role: req.body.role,        email: req.body.email,        password: hash      }, function(err, users) {        if (err) {          res.send(err);          return;        }        if (!users) {          res.send('User not created');          return;        } else {          res.json(users);        }      });    },    // login in the user    login: function(req, res) {      User.findOne({        $or: [{          username: req.body.email        }, {          email: req.body.email        }]      }, function(err, user) {        if (err) {          throw err;        }        if (!user) {          res.send({            message: 'Invalid username or email'          });          return;        } else if (!bcrypt.compareSync(req.body.password, user.password)) {          res.send({            message: 'Invalid password'          });          return;        } else {          req.session.username = user;          // create token          var token = createToken(user);          res.json({            user: user,            token: token          });        }      });    },    verifyUser: function(req, res, next) {      console.log('we have a user in our app');      var token = req.body.token || req.query.token || req.headers['x-access-token'];      //check if user exist      if (token) {        jwt.verify(token, config.secretKey, function(err, decoded) {          if (err) {            res.status(403).send({              error: 'User authentication failed'            });          } else {            req.decoded = decoded;            next();          }        });      } else {        res.status(403).send({          error: 'No token provided'        });      }    },    // get all user    getAllUsers: function(req, res) {      User.find({}, function(err, users) {        if (err) {          res.send(err);        }        res.json(users);      });    },    // get one user form the db    getUser: function(req, res) {      User.findOne({        _id: req.params.id      }, function(err, users) {        if (err) {          res.status(404).send({            error: 'User not found'          });        }        res.json(users);      });    },    // get documents by id    getDocumentByUserId: function(req, res) {      Doc.find({        ownerId: req.params.id      }, function(err, docs) {        if (err)          res.status(404).send({            error: 'Document not found'          });        else          res.send(docs);      });    },    // update user    updateUser: function(req, res) {      User.update({        _id: req.params.id      }, {        $set: {          username: req.body.username,          name: {            first: req.body.firstname,            last: req.body.lastname          },          email: req.body.email,          password: req.body.password        }      }, function(err) {        if (err)          res.status(500).send({            error: 'Update failed'          });        else          res.status(200).send({            message: 'Update succesful'          });      });    },    // delete user from user    deleteUser: function(req, res) {      User.remove({        _id: req.params.id      }, function(err, ok) {        if (err) {          res.statu(500).send({            error: 'Delete failed'          });        }        res.status(200).send(ok);      });    },    // log out    logout: function(req, res) {      req.session.destroy(function(err) {        if (!err) {          req.session = null;          var message = {};          message.success = true;          res.json(message);        }      });    }  };})();