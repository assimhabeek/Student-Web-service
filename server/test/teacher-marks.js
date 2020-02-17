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

describe('Teacher Marks', () => {

    before((done) => {
        User.insertMany(userMock, (err, res) => {
            Course.insertMany(CourseMock, (err, res) => {
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
                    .get('/teacher/marks')
                    .set('Authorization', mockToken.teacher)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Marks retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(3);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(-1);
                        done();
                    });
            });

        });
    });

    describe('/GET Marks', () => {
        it('it should get marks by page', (done) => {
            Mark.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/teacher/marks?page=1&pageSize=2')
                    .set('Authorization', mockToken.teacher)
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
                    .get(`/teacher/marks?page=1&pageSize=2&sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.teacher)
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
                    .get(`/teacher/marks?sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.teacher)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Marks retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(3);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(-1);
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
                    .get(`/teacher/marks/${mock[0].id}`)
                    .set('Authorization', mockToken.teacher)
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


    describe('/POST Mark', () => {
        it('it should create a new Mark', (done) => {
            chai.request(server)
                .post(`/teacher/marks`)
                .set('Authorization', mockToken.teacher)
                .send(mock[0])
                .end((err, res) => {
                    const mkr = res.body.data;
                    res.should.have.status(200);
                    res.body.message.should.eq('Mark created successfully');
                    mkr.should.be.a('object');
                    mkr.should.have.property('mark');
                    mkr.should.have.property('complain');
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

    describe('/PUT Mark', () => {
        it('it should  update Mark', (done) => {
            Mark.insertMany(mock[0], function (err, inserted) {
                let mark = JSON.parse(JSON.stringify(mock[0]));
                mark.complain = mark.complain + "-updated"
                mark.student = userMock[1].id
                mark.course = CourseMock[3].id
                mark.mark = 5

                chai.request(server)
                    .put(`/teacher/marks`)
                    .set('Authorization', mockToken.teacher)
                    .send(mark)
                    .end((err, res) => {
                        const mkr = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Mark updated successfully');
                        mkr.should.be.a('object');

                        mkr.should.have.property('mark');
                        mkr.should.have.property('complain');
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

                        mkr.complain.should.eq(mark.complain);
                        mkr.mark.should.eq(5);
                        mkr.student.username.should.eq(userMock[1].username);
                        mkr.course.abb.should.eq(CourseMock[3].abb);
                        done();
                    });
            });
        });
    });

    describe('/DELETE Mark by id', () => {
        it('it should Delete Marks by id', (done) => {
            Mark.insertMany(mock[0], function (err, inserted) {
                chai.request(server)
                    .delete(`/teacher/marks/${mock[0].id}`)
                    .set('Authorization', mockToken.teacher)
                    .end((err, res) => {
                        const mkr = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Mark deleted successfully');
                        mkr.should.be.a('object');
                        mkr.id.should.eq(mock[0].id);
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