const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const should = chai.should();

chai.use(chaiHttp);

describe("GET Hello world!!", () => {
  it("Should show message Hello world!!", (done) => {
    chai
      .request(app)
      .get("/api")
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.equal('Hello world!!');
        done();
      });
  });
});
