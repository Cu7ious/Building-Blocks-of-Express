var request = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();

client.select(process.env.NODE_ENV.length);
client.flushdb();

describe('Request to the root path:', function() {

    it('Returns a 200 status code', function(done) {
        request(app)
            .get('/')
            .expect(200, done);
    });

    it('Returns an HTML format', function(done) {
        request(app)
            .get('/')
            .expect('Content-Type', /html/, done);
    });

    it('Returns an index file with Cities', function(done) {
        request(app)
            .get('/')
            .expect(/cities/i, done);
    });

});

describe('Listing cities on /cities:', function() {

    it('Returns a 200 status code', function(done) {
        request(app)
            .get('/cities')
            .expect(200, done);
    });

    it('Returns JSON format', function(done) {
        request(app)
            .get('/cities')
            .expect('Content-Type', /json/, done);
    });

    it('Returns initial cities', function(done) {
        request(app)
            .get('/cities')
            .expect(JSON.stringify([]), done);

    });
});

describe('Creating new cities:', function() {

    it('Returns a 200 status code', function(done) {
        request(app)
            .post('/cities')
            .send('name=Ololoev&description=Its+like+an+Omsk+but+weaker')
            .expect(200, done);
    });

    it('Returns the city name', function(done) {
        request(app)
            .post('/cities')
            .send('name=Ololoev&description=Its+like+an+Omsk+but+weaker')
            .expect(/ololoev/i, done);
    });

});

describe('Deleting cities:', function() {

    before(function() {
        client.hset('cities', 'Banana', 'A tasty fruit.');
    });

    it('Returns a 204 status code', function(done) {
        request(app)
            .delete('/cities/Banana')
            .expect(204, done);
    });

    after(function() {
        client.flushdb();
    });

});

// describe('', function() {
// });
