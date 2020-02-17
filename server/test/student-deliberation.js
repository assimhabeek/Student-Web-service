import Deliberation from '../models/deliberations-model';
import userMock from './mock-data/user-mock-data';
import mock from './mock-data/deliberation-mock-data';
import mockToken from './mock-data/mockTokens';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import User from '../models/users-model';

const should = chai.should();

chai.use(chaiHttp);

describe('Student Deliberations', () => {

    before((done) => {
        User.insertMany(userMock, (err, res) => {
            done();
        });
    })

    beforeEach((done) => {
        //Before each test we empty the database
        Deliberation.deleteMany({}, (err) => {
            done();
        });
    })


    describe('/GET Deliberations', () => {
        it('it should GET all the Deliberations', (done) => {
            Deliberation.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/student/deliberations')
                    .set('Authorization', mockToken.student)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Deliberations retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.length.should.be.eql(1);
                        done();
                    });
            });

        });
    });


    describe('/GET Deliberation by id', () => {
        it('it should GET Deliberation by id', (done) => {

            Deliberation.insertMany(mock[0], function (err, inserted) {
                chai.request(server)
                    .get(`/student/deliberations/${mock[0].id}`)
                    .set('Authorization', mockToken.student)
                    .end((err, res) => {
                        const dlbrtion = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Deliberation retrieved successfully');
                        dlbrtion.should.be.a('object');
                        dlbrtion.should.have.property('id');
                        dlbrtion.id.should.eq(mock[0].id);
                        dlbrtion.should.have.property('unit1');
                        dlbrtion.should.have.property('unit2');
                        dlbrtion.should.have.property('unit3');
                        dlbrtion.should.have.property('complain');
                        dlbrtion.should.have.property('student');
                        dlbrtion.student.should.have.property('id');
                        dlbrtion.student.should.have.property('name');
                        dlbrtion.student.should.have.property('type');
                        dlbrtion.student.should.have.property('username');
                        done();
                    });
            });

        });
    });

    describe('/PUT Deliberation', () => {
        it('it should  update Deliberation', (done) => {
            Deliberation.insertMany(mock[0], function (err, inserted) {
                let deliberation = JSON.parse(JSON.stringify(mock[0]));
                deliberation.complain = 'This is my complain !'

                chai.request(server)
                    .put(`/student/deliberations/complaint`)
                    .set('Authorization', mockToken.student)
                    .send(deliberation)
                    .end((err, res) => {
                        const dlbrtion = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('The complaint is added !');
                        dlbrtion.should.be.a('object');
                        dlbrtion.should.have.property('id');
                        dlbrtion.id.should.eq(mock[0].id);
                        dlbrtion.should.have.property('unit1');
                        dlbrtion.should.have.property('unit2');
                        dlbrtion.should.have.property('unit3');
                        dlbrtion.should.have.property('complain');
                        dlbrtion.should.have.property('student');
                        dlbrtion.complain.should.eq('This is my complain !');
                        done();
                    });
            });
        });
    });


    after((done) => {
        User.deleteMany({}, (er) => {
            Deliberation.deleteMany({}, (er) => {
                done();
            });
        });
    });
});