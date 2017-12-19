/* eslint-disable no-unused-expressions */
const chai = require('chai');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('./../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () =>
    chai.request(server)
      .get('/')
      .then((response) => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch((err) => { throw err; }));
  it('should return a 404 for a route that does not exist', () =>
    chai.request(server)
      .get('/sad')
      .then((response) => {
        response.should.have.status(404);
      })
      .catch((err) => { throw err; }));
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch((error) => { throw error; });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch((error) => { throw error; });
  });

  describe('GET /api/v1/items', () => {
    it('should return all items in garage', () => chai.request(server)
      .get('/api/v1/items')
      .then((response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('items');
        response.body.items.should.a('array');
        response.body.items.length.should.equal(5);
      })
      .catch((error) => { throw error; }));
  });
  describe('GET /api/v1/items/:id', () => {
    it('should return one item in the garage with given id', () => chai.request(server)
      .get('/api/v1/items/1')
      .then((response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.have.property('item');
        response.body.item.should.have.property('id');
        response.body.item.id.should.be.a('number');
        response.body.item.should.have.property('name');
        response.body.item.name.should.be.a('string');
        response.body.item.should.have.property('reason');
        response.body.item.reason.should.be.a('string');
        response.body.item.should.have.property('cleanliness');
        response.body.item.cleanliness.should.be.a('string');
      })
      .catch((error) => { throw error; }));
    it('should return an error if item does not exist in garage', () => chai.request(server)
      .get('/api/v1/items/999')
      .then((response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.have.property('error');
        response.body.error.should.be.a('string');
      })
      .catch((error) => { throw error; }));
  });
  describe('POST /api/v1/items', () => {
    it('should create a new item in the garage', () => chai.request(server)
      .post('/api/v1/items')
      .send({
        name: 'paint can',
        reason: 'might need to retouch the bathroom',
        cleanliness: 'sparkling',
      })
      .then((response) => {
        response.should.have.status(201);
        response.should.be.json;
      })
      .catch((error) => { throw error; }));
    it('should return an error if it does not have all properties', () => chai.request(server)
      .post('/api/v1/items')
      .send({
        name: 'paint can',
        reason: 'might need to retouch the bathroom',
      })
      .then((response) => {
        response.should.have.status(500);
      })
      .catch((error) => { throw error; }));
  });
  describe('PATCH /api/v1/items/:id', () => {
    it('should edit existing item in garage given valid properties', () => chai.request(server)
      .patch('/api/v1/items/3')
      .send({ name: 'flat tennis ball' })
      .then((response) => {
        response.should.have.status(202);
        response.should.be.json;
      })
      .catch((error) => { throw error; }));
    it('should return an error if item has invalid properties', () => chai.request(server)
      .patch('/api/v1/items/3')
      .send({ age: 50 })
      .then((response) => {
        response.should.have.status(500);
      })
      .catch((error) => { throw error; }));
  });
});
