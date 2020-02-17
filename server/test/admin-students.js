import Student from '../models/users-model';
import mock from './mock-data/user-mock-data';
import mockToken from './mock-data/mockTokens';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
const should = chai.should();
import bcrypt from 'bcrypt';


chai.use(chaiHttp);

describe('Students', () => {

    beforeEach((done) => {
        //Before each test we empty the database
        Student.deleteMany({}, (err) => {
            done();
        });
    });


    describe('/GET Students', () => {
        it('it should GET all the students', (done) => {
            Student.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/admin/students')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Students retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(2);
                        res.body.data.pageIndex.should.be.eql(1);
                        res.body.data.pageSize.should.be.eql(-1);
                        done();
                    });
            });

        });
    });

    describe('/GET Students', () => {
        it('it should get students by page', (done) => {
            Student.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/admin/students?page=1&pageSize=2')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Students retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.should.be.a('array');
                        res.body.data.records.length.should.eql(2);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(2);
                        res.body.data.total.should.eq(2);
                        done();
                    });
            });
        });
    });

    describe('/GET Student by id', () => {
        it('it should GET student by id', (done) => {

            Student.insertMany(mock[0], function (err, inserted) {
                chai.request(server)
                    .get(`/admin/students/${mock[0].id}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        const std = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Student retrieved successfully');

                        std.should.be.a('object');

                        std.id.should.eq(mock[0].id);
                        std.should.have.property('name');
                        std.name.should.have.property('last');
                        std.name.should.have.property('first');
                        std.should.have.property('type');
                        std.type.should.eq('student');

                        std.should.have.property('fullName');

                        std.should.have.property('username');

                        std.should.not.have.property('password');

                        done();
                    });
            });

        });
    });


    describe('/POST Student', () => {
        it('it should create a new student', (done) => {
            chai.request(server)
                .post(`/admin/students`)
                .set('Authorization', mockToken.admin)
                .send(mock[0])
                .end((err, res) => {
                    const std = res.body.data;
                    res.should.have.status(200);
                    res.body.message.should.eq('Student created successfully');
                    std.should.be.a('object');
                    std.id.should.eq(mock[0].id);
                    std.should.have.property('name');
                    std.name.should.have.property('last');
                    std.name.should.have.property('first');
                    std.should.have.property('fullName');
                    std.should.have.property('username');
                    std.should.have.property('password');
                    std.should.have.property('type');
                    std.type.should.eq('student');

                    bcrypt.compare(mock[0].password, std.password, function (err, re) {
                        re.should.eq(true);
                    });

                    done();
                });
        });
    });

    describe('/PUT Student', () => {
        it('it should  update student', (done) => {
            Student.insertMany(mock[0], function (err, inserted) {
                let student = JSON.parse(JSON.stringify(mock[0]));
                let oldUsername = student.username;
                student.name.first = student.name.first + "-updated"
                student.name.last = student.name.last + "-updated"
                student.username = student.username + "-updated"
                student.password = student.password + "-updated"

                chai.request(server)
                    .put(`/admin/students`)
                    .set('Authorization', mockToken.admin)
                    .send(student)
                    .end((err, res) => {
                        const std = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Student updated successfully');
                        std.should.be.a('object');
                        std.id.should.eq(mock[0].id);
                        std.should.have.property('name');
                        std.name.should.have.property('last');
                        std.name.should.have.property('first');
                        std.should.have.property('fullName');
                        std.should.have.property('username');
                        std.should.not.have.property('password');
                        std.should.have.property('type');
                        std.type.should.eq('student');

                        std.name.last.should.eq(student.name.last);
                        std.name.first.should.eq(student.name.first);

                        // so the username and password are not editble from here
                        std.username.should.eq(oldUsername);
                        done();
                    });
            });
        });
    });

    describe('/DELETE Student by id', () => {
        it('it should Delete students by id', (done) => {

            Student.insertMany(mock[0], function (err, inserted) {
                chai.request(server)
                    .delete(`/admin/students/${mock[0].id}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        const std = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Student deleted successfully');
                        std.should.be.a('object');
                        std.id.should.eq(mock[0].id);
                        std.should.have.property('name');
                        done();
                    });
            });

        });
    });

    after((done) => {
        Student.deleteMany({}, (err) => {
            done();
        });
    });

});
