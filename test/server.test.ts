import app, { io, stopExpress } from '../src/server';

import supertest from 'supertest';

describe('App', () => {
    let request: any;

    beforeEach(() => {
        request = supertest(app);
    });

    afterAll(() => {
        stopExpress();
        io.close();
    });

    it('Should return code 200 for GET /', (done) => {
        request.get('/').expect(200, done);
    });
});
