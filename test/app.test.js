const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const fakeToken = require('../src/security/fake-token.security');
const HelloWorld = require('../src/models/hello-world.model');

chai.should();
chai.use(chaiHttp);

beforeEach((done) => {
  new HelloWorld()
      .save((err, res) => {
        done();
      });
});

afterEach((done) => {
  HelloWorld
      .deleteMany({}, (err, res) => {
        done();
      });
});

describe('GET Hello world!!', () => {
  it('Should show message: Hello world!!', (done) => {
    chai
        .request(app)
        .get('/api/hello-world')
        .set('x-access-token', fakeToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.equal('Hello world!!');
          done();
        });
  });
});
