var request = require('superagent'),
  faker = require('faker'),
  check = require('./helpers');

describe('Document manager API testing', function() {
  var Url = 'http://localhost:3000/',
    userId, token;

  var user = {
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    role: 'admin',
    email: faker.internet.email(),
    password: faker.name.findName()
  };

  describe('User Resource /api/users', function() {
    it('should create a user when api/users is called', function(done) {
      request
        .post(Url + 'api/users')
        .send(user)
        .end(function(err, res) {
          var response = res.body.user;
          if (res.status === 200) {
            userId = response._id;
            expect(res.type).toBe('application/json');
            expect(typeof response).toBe('object');
            expect(response._id).toBeDefined();
            expect(response.username).toEqual(user.username);
            expect(response.role).toEqual(user.role);
            expect(response.name.first).toEqual(user.firstname);
            expect(response.name.last).toEqual(user.lastname);
            expect(typeof response.password).toBe('string');
          } else {
            expect(res.status).toBe(400);
            expect(response.error).toBe('User not created');
          }
          done();
        });
    });

    it('should login the user', function(done) {
      request
        .post(Url + 'api/users/login')
        .accept('application/json')
        .send({
          email: user.email,
          password: user.password
        })
        .end(function(err, res) {
          var response = res.body;
          token = response.token;
          if (res.status === 200) {
            expect(res.type).toBe('application/json');
            expect(typeof response).toBe('object');
            expect(typeof response._id).toBeDefined();
            expect(response.token).toBeDefined();
          } else if (res.status === 500) {
            expect(response.message).toBe('No credentials provided' ||
              'Invalid password' ||
              'No token provided');
          } else {
            expect(response.error).toBe('No token provided');
          }
          done();
        });
    });


    it('should retrive users', function(done) {
      request
        .get(Url + 'api/users')
        .set('x-access-token', token)
        .end(function(err, res) {
          var response = res.body;
          if (res.status === 200) {
            expect(res.type).toBe('application/json');
            expect(typeof response).toBe('object');
            expect(response.length).toBeGreaterThan(0);
            expect(check.isUserData).toBeTruthy();
          } else {
            expect(res.status).toBe(404);
            expect(response.error).toBe('Users not found');
          }
          done();
        });
    });


    it('should retrive user by id', function(done) {
      request
        .get(Url + 'api/users/' + userId)
        .set('x-access-token', token)
        .end(function(err, res) {
          var response = res.body;
          if (res.status === 200) {
            expect(res.type).toBe('application/json');
            expect(typeof response).toBe('object');
          } else if (res.status === 404) {
            expect(response.error).toBe('User not found');
          } else {
            expect(response.error).toBe('No token provided');
          }
          done();
        });
    });

    it('should update user', function(done) {
      user = {
        username: faker.internet.userName(),
        name: {
          first: faker.name.firstName(),
          lastn: faker.name.lastName(),
        },
        role: 'admin',
        email: faker.internet.email(),
        password: faker.name.findName()
      };
      request
        .put(Url + 'api/users/' + userId)
        .set('x-access-token', token)
        .send(user)
        .accept('application/json')
        .end(function(err, res) {
          var response = res.body;
          if (res.status === 200) {
            expect(res.type).toBe('application/json');
            expect(typeof response).toBe('object');
            expect(response.message).toBe('Update succesful');
          } else if (res.status === 500) {
            expect(response.error).toBe('Update failed');
          } else {
            expect(response.error).toBe('No token provided');
          }
          done();
        });
    });

    it('delete Resource', function(done) {

      request
        .del(Url + 'api/users/' + userId)
        .set('x-access-token', token)
        .accept('application/json')
        .end(function(err, res) {
          var response = res.body;
          if (res.status === 200) {
            expect(res.type).toBe('application/json');
            expect(typeof response).toBe('object');
            expect(response.ok).toBe(1);
            expect(response.n).toBe(1);
          } else if (res.status === 500) {
            expect(response.error).toBe('Delete failed');
          } else {
            expect(response.error).toBe('No token provided');
          }
          done();
        });
    });
  });
});
