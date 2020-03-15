const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const bcrypt = require('bcrypt');
const SALT_RANDS = 12;
const token = require('../src/security/fake-token.security');

chai.should();
chai.use(chaiHttp);

const User = require('../src/models/user.model');
let userId = null;

beforeEach((done) => {
  bcrypt.hash('spdrmn', SALT_RANDS)
      .then((encoded) => {
        new User({
          name: 'Spider man',
          email: 'spiderman@mail.com',
          password: encoded,
        }).save((err, user) => {
          userId = user.id;
          done();
        });
      });
});

afterEach((done) => {
  User.deleteOne({
    email: 'spiderman@mail.com',
  },
  (err, user) => {
    done();
  });
});

describe('POST /login', () => {
  it('Should show message: Incorrect password.', (done) => {
    chai
        .request(app)
        .post('/login')
        .send({
          email: 'spiderman@mail.com',
          password: 'mary-jane',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.equal('Incorrect password');
          done();
        });
  });
});

describe('POST /login', () => {
  it('Should generate token and login', (done) => {
    chai
        .request(app)
        .post('/login')
        .send({
          email: 'spiderman@mail.com',
          password: 'spdrmn',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('auth').eq(true);
          res.body.should.have.property('token');
          done();
        });
  });
});

describe('GET /users/:id', () => {
  it('Should get user by ID', (done) => {
    chai
        .request(app)
        .get(`/api/users/${userId}`)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('_id').eq(userId);
          res.body.should.have.property('name').eq('Spider man');
          res.body.should.have.property('email').eq('spiderman@mail.com');
          res.body.should.have.property('password').eq(null);
          done();
        });
  });
});
