import User from '../models/users-model';
import mock from './mock-data/user-mock-data';
import jwt from 'jsonwebtoken';
import mockToken from './mock-data/mockTokens';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
const should = chai.should();
import config from '../config/config';


chai.use(chaiHttp);
//Our parent block

describe('Auth', () => {

    before((done) => {
        User.deleteMany({}, (err) => {
            User.insertMany(mock, (err,inserted) => {
                done();
            });
        });
    });



    describe('/Post login', () => {
        it('it should return a token that contains the user informations', (done) => {

            chai.request(server)
                .post('/login')
                .send(
                    {
                        username: 'user-1-username',
                        // we don't use the mock object because the password is hashed
                        password: 'user-1-password'
                    })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.eq('LoggedIn successfully !');
                    const token = res.body.data.token;
                    const usr = jwt.verify(token, config.apiKey);
                    usr.should.have.property('username');
                    usr.should.have.property('name');
                    usr.name.should.have.property('first');
                    usr.name.should.have.property('last');
                    usr.should.have.property('type');
                    usr.should.have.property('id');
                    usr.username.should.eq('user-1-username');
                    done();
                });
        });
    });


    describe('/Post login', () => {
        it('it should return User not found !', (done) => {

            chai.request(server)
                .post('/login')
                .send(
                    {
                        // wrong username 
                        username: 'user-1-use',
                        password: 'user-1-password'
                    })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.success.should.eq(false);
                    res.body.message.should.eq('User not found !');
                    done();
                });
        });
    });




    describe('/Post login', () => {
        it('it should Wrong username or password !', (done) => {

            chai.request(server)
                .post('/login')
                .send(
                    {
                        // wrong password 
                        username: 'user-1-username',
                        password: 'user-1-passw'
                    })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.success.should.eq(false);
                    res.body.message.should.eq('Wrong username or password !');
                    done();
                });
        });
    });


    describe('/GET isloggedIn', () => {
        it('it should return a user', (done) => {

            chai.request(server)
                .get('/isLoggedIn')
                .set('Authorization', mockToken.admin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.eq('The user is loggedIn !');
                    const usr = res.body.data;
                    usr.should.have.property('username');
                    usr.should.have.property('name');
                    usr.name.should.have.property('first');
                    usr.name.should.have.property('last');
                    usr.should.have.property('type');
                    usr.should.have.property('id');
                    usr.username.should.eq('user-5-username');
                    done();
                });
        });
    });



    describe('/GET isloggedIn with wrong token', () => {
        it('it should return null', (done) => {
            chai.request(server)
                .get('/isLoggedIn')
                .set('Authorization', mockToken.admin.replace('e', 'b'))
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.eq('The user is not loggedIn !');
                    should.equal(res.body.data, null);
                    done();
                });
        });
    });

    describe('/GET isloggedIn with no token', () => {
        it('it should return null', (done) => {
            chai.request(server)
                .get('/isLoggedIn')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.message.should.eq('The user is not loggedIn !');
                    should.equal(res.body.data, null);
                    done();
                });
        });
    });


    after((done) => {
        User.deleteMany({}, (err) => {
            done();
        });
    });


});