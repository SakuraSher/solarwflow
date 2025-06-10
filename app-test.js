const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');
const mongoose = require('mongoose');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Solar System API', () => {
  before(async () => {
    // Wait for connection if needed
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  });

  after(async () => {
    await mongoose.disconnect();
  });

  describe('GET /', () => {
    it('should serve index.html', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    });
  });

  describe('POST /planet', () => {
    it('should return planet data for valid ID', (done) => {
      chai.request(app)
        .post('/planet')
        .send({ id: 1 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('name');
          done();
        });
    });

    it('should handle invalid planet IDs', (done) => {
      chai.request(app)
        .post('/planet')
        .send({ id: 999 })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal('Error in Planet Data');
          done();
        });
    });
  });
});