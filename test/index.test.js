const request = require('supertest');
const {app}  = require('../server.js');


describe ('Test Ex', () => {
    test('GET /', (done) =>{
        request(app)
            .get('/api/v1/transactions/')
            .expect("Content-Type", application/json)
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                } else {
                    return done();
                }
            })

    });

    test('POST /', (done) =>{
        request(app)
            .post('/api/v1/transactions/')
            //.expect("Content-Type", application/json)
            .send({
                text: "Testing API",
                amount: 900
            })
            .expect(201)
            .end((err, res) => {
                if(err){
                    return done(err);
                } else {
                    return done();
                }
            })

    });


    //TO-DO:
    //Add Test to check Delete API

    // test('DELETE /:id', (done) =>{
    //     request(server)
    //         .delete('/:id')
    //         .expect("Content-Type", /json/)
    //         .expect(404)

    // });
});

