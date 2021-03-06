import Course from '../models/courses-model';
import userMock from './mock-data/user-mock-data';
import mock from './mock-data/course-mock-data';
import mockToken from './mock-data/mockTokens';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import User from '../models/users-model';
const should = chai.should();

chai.use(chaiHttp);

describe('Courses', () => {

    before((done) => {
        User.insertMany(userMock, (err, res) => {
            done();
        });
    })

    beforeEach((done) => {
        //Before each test we empty the database
        Course.deleteMany({}, (err) => {
            done();
        });
    });


    describe('/GET Courses', () => {
        it('it should GET all the Courses', (done) => {
            Course.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/admin/courses')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Courses retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(mock.length);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(-1);
                        done();
                    });
            });

        });
    });


    describe('/GET Courses', () => {
        it('it should get courses by page', (done) => {
            Course.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/admin/courses?page=1&pageSize=2')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Courses retrieved successfully');
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

    describe('/GET Courses', () => {
        it('it should get courses by page and sort them by abb', (done) => {
            Course.insertMany(mock, function (err, inserted) {
                const sort = 'abb';
                const sortDir = 1;
                chai.request(server)
                    .get(`/admin/courses?page=1&pageSize=2&sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Courses retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.should.be.a('array');
                        res.body.data.records.length.should.eql(2);
                        res.body.data.records.map(x => x.abb).isSorted().should.eq(sortDir);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(2);
                        res.body.data.total.should.eq(4);
                        done();
                    });
            });
        });
    });

    describe('/GET Courses', () => {
        it('it should get courses and sort them by abb', (done) => {
            Course.insertMany(mock, function (err, inserted) {
                const sort = 'abb';
                const sortDir = -1;
                chai.request(server)
                    .get(`/admin/courses?sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Courses retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(mock.length);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(-1);
                        res.body.data.records.map(x => x.abb).isSorted().should.eq(sortDir);
                        done();
                    });
            });
        });
    });


    describe('/GET Course by id', () => {
        it('it should GET Course by id', (done) => {

            Course.insertMany(mock[0], function (err, inserted) {
                chai.request(server)
                    .get(`/admin/courses/${mock[0].id}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        const crs = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Course retrieved successfully');
                        crs.should.be.a('object');
                        crs.should.have.property('id');
                        crs.id.should.eq(mock[0].id);
                        crs.should.have.property('abb');
                        crs.should.have.property('unit');
                        crs.should.have.property('teacher');
                        crs.teacher.should.have.property('id');
                        crs.teacher.should.have.property('name');
                        crs.teacher.should.have.property('type');
                        crs.teacher.should.have.property('username');
                        done();
                    });
            });

        });
    });


    describe('/POST Course', () => {
        it('it should create a new Course', (done) => {
            chai.request(server)
                .post(`/admin/courses`)
                .set('Authorization', mockToken.admin)
                .send(mock[0])
                .end((err, res) => {
                    const crs = res.body.data;
                    res.should.have.status(200);
                    res.body.message.should.eq('Course created successfully');
                    crs.should.be.a('object');
                    crs.should.have.property('id');
                    crs.id.should.eq(mock[0].id);
                    crs.should.have.property('abb');
                    crs.should.have.property('unit');
                    crs.should.have.property('teacher');
                    crs.teacher.should.have.property('id');
                    crs.teacher.should.have.property('name');
                    crs.teacher.should.have.property('type');
                    crs.teacher.should.have.property('username');
                    done();
                });
        });
    });

    describe('/PUT Course', () => {
        it('it should  update Course', (done) => {
            Course.insertMany(mock[0], function (err, inserted) {
                let course = JSON.parse(JSON.stringify(mock[0]));
                course.abb = course.abb + "-updated"
                course.name = course.name + "-updated"
                course.description = course.description + "-updated"
                course.unit = 3 - course.unit
                // the index of the user with username = user-4-username is 3
                // so if we change this index to some other index it should give another id
                course.teacher = userMock[3].id;

                chai.request(server)
                    .put(`/admin/courses`)
                    .set('Authorization', mockToken.admin)
                    .send(course)
                    .end((err, res) => {
                        const crs = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Course updated successfully');
                        crs.should.be.a('object');
                        crs.should.have.property('id');
                        crs.id.should.eq(mock[0].id);
                        crs.should.have.property('abb');
                        crs.should.have.property('unit');
                        crs.should.have.property('teacher');
                        crs.teacher.should.have.property('id');
                        crs.teacher.should.have.property('name');
                        crs.teacher.should.have.property('type');
                        crs.teacher.should.have.property('username');
                        crs.abb.should.eq(course.abb);
                        crs.name.should.eq(course.name);
                        crs.description.should.eq(course.description);
                        crs.teacher.username.should.eq('user-4-username');
                        done();
                    });
            });
        });
    });

    describe('/DELETE Course by id', () => {
        it('it should Delete Courses by id', (done) => {
            Course.insertMany(mock[0], function (err, inserted) {
                chai.request(server)
                    .delete(`/admin/courses/${mock[0].id}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        const crs = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Course deleted successfully');
                        crs.should.be.a('object');
                        crs.id.should.eq(mock[0].id);
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