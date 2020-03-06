const request = require('supertest');
const app = require('../app');

beforeAll(async () => {
    console.log('Launching Sign up app tests.');
});

afterAll(() => {
    console.log('Sign up tests finished.');
});

describe('Hello world!!', () => {

    test('Expect response to contain message: Hello world!!', async () => {
        const response = await request(app).get('/api');
        expect(response.status).toEqual(200);
        expect(response.text).toContain('Hello world!!');
  
     });
});