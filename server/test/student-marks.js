import Mark from '../models/marks-model';
import userMock from './mock-data/user-mock-data';
import CourseMock from './mock-data/course-mock-data';
import mock from './mock-data/mark-mock-data';
import mockToken from './mock-data/mockTokens';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import User from '../models/users-model';
import Course from '../models/courses-model';

const should = chai.should();

chai.use(chaiHttp);

describe('Student Marks', () => {

    before((done) => {
        User.insertMany(userMock, (err, res) => {
            Course.insertMany(CourseMock, (err, ress) => {
                done();
            });
        });
    })

    beforeEach((done) => {
        //Before each test we empty the database
        Mark.deleteMany({}, (err) => {
            done();
        });
    });


    describe('/GET Marks', () => {
        it('it should GET all the Marks', (done) => {
            Mark.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/student/marks')
                    .set('Authorization', mockToken.student)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Marks retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.length.should.be.eql(3);
                        done();
                    });
            });

        });
    });

    describe('/GET Marks', () => {
        it('it should get marks by page', (done) => {
            Mark.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/student/marks?page=1&pageSize=2')
                    .set('Authorization', mockToken.student)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Marks retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.should.be.a('array');
                        res.body.data.records.length.should.eql(2);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(2);
                        res.body.data.total.should.eq(3);
                        done();
                    });
            });
        });
    });

    describe('/GET Marks', () => {
        it('it should get marks by page and sort them by mark', (done) => {
            Mark.insertMany(mock, function (err, inserted) {
                const sort = 'mark';
                const sortDir = 1;
                chai.request(server)
                    .get(`/student/marks?page=1&pageSize=2&sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.student)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Marks retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.should.be.a('array');
                        res.body.data.records.length.should.eql(2);
                        res.body.data.records.map(x => x.mark).isSorted().should.eq(sortDir);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(2);
                        res.body.data.total.should.eq(3);
                        done();
                    });
            });
        });
    });

    describe('/GET Marks', () => {
        it('it should get marks and sort them by mark', (done) => {
            Mark.insertMany(mock, function (err, inserted) {
                const sort = 'mark';
                const sortDir = -1;
                chai.request(server)
                    .get(`/student/marks?sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.student)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Marks retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.length.should.eql(3);
                        res.body.data.records.map(x => x.mark).isSorted().should.eq(sortDir);
                        done();
                    });
            });
        });
    });


    describe('/GET Mark by id', () => {
        it('it should GET Mark by id', (done) => {

            Mark.insertMany(mock[0], function (err, inserted) {
                chai.request(server)
                    .get(`/student/marks/${mock[0].id}`)
                    .set('Authorization', mockToken.student)
                    .end((err, res) => {
                        const mkr = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Mark retrieved successfully');
                        mkr.should.be.a('object');
                        mkr.should.have.property('id');
                        mkr.id.should.eq(mock[0].id);
                        mkr.should.have.property('complain');
                        mkr.should.have.property('mark');
                        mkr.should.have.property('student');
                        mkr.should.have.property('course');
                        mkr.student.should.have.property('id');
                        mkr.student.should.have.property('name');
                        mkr.student.should.have.property('type');
                        mkr.student.should.have.property('username');
                        mkr.course.should.have.property('id');
                        mkr.course.should.have.property('unit');
                        mkr.course.should.have.property('teacher');
                        mkr.course.should.have.property('abb');
                        done();
                    });
            });

        });
    });

    describe('/PUT Complaint mark', () => {
        it('it should  update complaint in mark', (done) => {
            Mark.insertMany(mock[0], function (err, inserted) {
                let mark = JSON.parse(JSON.stringify(mock[0]));
                mark.complain = "This is my complain !"
                chai.request(server)
                    .put(`/student/marks/complaint`)
                    .set('Authorization', mockToken.student)
                    .send(mark)
                    .end((err, res) => {
                        const mkr = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('The complaint is added !');
                        mkr.should.be.a('object');
                        mkr.should.have.property('mark');
                        mkr.should.have.property('complain');
                        mkr.should.have.property('student');
                        mkr.should.have.property('course');
                        mkr.complain.should.eq('This is my complain !');
                        done();
                    });
            });
        });
    });


    after((done) => {
        User.deleteMany({}, (er) => {
            Course.deleteMany({}, (er) => {
                done();
            });
        });
    });
});