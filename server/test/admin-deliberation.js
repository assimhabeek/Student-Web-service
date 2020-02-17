import Deliberation from '../models/deliberations-model';
import userMock from './mock-data/user-mock-data';
import markMock from './mock-data/mark-mock-data';
import courseMock from './mock-data/course-mock-data';
import mock from './mock-data/deliberation-mock-data';
import mockToken from './mock-data/mockTokens';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import User from '../models/users-model';
import Course from '../models/courses-model';
import Mark from '../models/marks-model';

const should = chai.should();

chai.use(chaiHttp);

describe('Admin Deliberations', () => {

    before((done) => {
        Course.insertMany(courseMock, (err, rs) => {
            User.insertMany(userMock, (err, res) => {
                Mark.insertMany(markMock, (e, r) => {
                    done();
                })
            });
        })
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
                    .get('/admin/deliberations')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Deliberations retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(mock.length);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(-1);
                        done();
                    });
            });

        });
    });

    describe('/GET Deliberations', () => {
        it('it should get deliberations by page', (done) => {
            Deliberation.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/admin/deliberations?page=1&pageSize=2')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Deliberations retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.should.be.a('array');
                        res.body.data.records.length.should.eql(2);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(2);
                        res.body.data.total.should.eq(4);
                        done();
                    });
            });
        });
    });

    describe('/GET Deliberations', () => {
        it('it should get deliberations by page and sort them by unit1', (done) => {
            Deliberation.insertMany(mock, function (err, inserted) {
                const sort = 'unit1';
                const sortDir = 1;
                chai.request(server)
                    .get(`/admin/deliberations?page=1&pageSize=2&sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Deliberations retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.should.be.a('array');
                        res.body.data.records.length.should.eql(2);
                        res.body.data.records.map(x => x.unit1).isSorted().should.eq(sortDir);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(2);
                        res.body.data.total.should.eq(4);
                        done();
                    });
            });
        });
    });

    describe('/GET Deliberations', () => {
        it('it should get deliberations and sort them by unit1', (done) => {
            Deliberation.insertMany(mock, function (err, inserted) {
                const sort = 'unit1';
                const sortDir = -1;
                chai.request(server)
                    .get(`/admin/deliberations?sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Deliberations retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(mock.length);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(-1);
                        res.body.data.records.map(x => x.unit1).isSorted().should.eq(sortDir);
                        done();
                    });
            });
        });
    });


    describe('/GET Deliberation by id', () => {
        it('it should GET Deliberation by id', (done) => {

            Deliberation.insertMany(mock[0], function (err, inserted) {
                chai.request(server)
                    .get(`/admin/deliberations/${mock[0].id}`)
                    .set('Authorization', mockToken.admin)
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




    describe('/POST Deliberation', () => {
        it('it should create a new Deliberation', (done) => {
            chai.request(server)
                .post(`/admin/deliberations`)
                .set('Authorization', mockToken.admin)
                .send(mock[0])
                .end((err, res) => {
                    const dlbrtion = res.body.data;
                    res.should.have.status(200);
                    res.body.message.should.eq('Deliberation created successfully');
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

    describe('/PUT Deliberation', () => {
        it('it should  update Deliberation', (done) => {
            Deliberation.insertMany(mock[0], function (err, inserted) {
                let deliberation = JSON.parse(JSON.stringify(mock[0]));
                deliberation.complain = deliberation.complain + '-updated'
                deliberation.unit1 = 10
                deliberation.unit2 = 11
                deliberation.unit3 = 12

                deliberation.student = userMock[1].id;

                chai.request(server)
                    .put(`/admin/deliberations`)
                    .set('Authorization', mockToken.admin)
                    .send(deliberation)
                    .end((err, res) => {
                        const dlbrtion = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Deliberation updated successfully');
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

                        dlbrtion.unit1.should.eq(10);
                        dlbrtion.unit2.should.eq(11);
                        dlbrtion.unit3.should.eq(12);
                        dlbrtion.complain.should.eq(deliberation.complain);

                        dlbrtion.student.username.should.eq('user-2-username');
                        done();
                    });
            });
        });
    });

    describe('/DELETE Deliberation by id', () => {
        it('it should Delete Deliberations by id', (done) => {
            Deliberation.insertMany(mock[0], function (err, inserted) {
                chai.request(server)
                    .delete(`/admin/deliberations/${mock[0].id}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        const dlbrtion = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Deliberation deleted successfully');
                        dlbrtion.should.be.a('object');
                        dlbrtion.id.should.eq(mock[0].id);
                        done();
                    });
            });

        });
    });

    describe('/POST Deliberation ', () => {
        it('it should auto autoGenerate', (done) => {
            chai.request(server)
                .post(`/admin/deliberations/auto`)
                .set('Authorization', mockToken.admin)
                .end((err, res) => {
                    const dlrCount = res.body.data.count;
                    res.should.have.status(200);
                    res.body.message.should.eq('Deliberations created successfully');
                    dlrCount.should.eq(2);
                    done();
                });

        });
    });


    after((done) => {
        User.deleteMany({}, (er) => {
            Deliberation.deleteMany({}, (er) => {
                Course.deleteMany({}, (er) => {
                    Mark.deleteMany({}, (er) => {
                        done();
                    });
                });
            });
        });
    });
});