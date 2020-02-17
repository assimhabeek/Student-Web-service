import Teacher from '../models/users-model';
import mock from './mock-data/user-mock-data';
import mockToken from './mock-data/mockTokens';

//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
const should = chai.should();
import bcrypt from 'bcrypt';


chai.use(chaiHttp);

describe('Teacher', () => {

    beforeEach((done) => {
        //Before each test we empty the database
        Teacher.deleteMany({}, (err) => {
            done();
        });
    });


    describe('/GET Teacher', () => {
        it('it should GET all the teacher', (done) => {
            Teacher.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/admin/teachers')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Teachers retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(2);
                        res.body.data.pageIndex.should.be.eql(1);
                        res.body.data.pageSize.should.be.eql(-1);
                       done();
                    });
            });

        });
    });

    describe('/GET Teachers', () => {
        it('it should get teachers by page', (done) => {
            Teacher.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/admin/teachers?page=1&pageSize=2')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Teachers retrieved successfully');
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

    describe('/GET Teacher by id', () => {
        it('it should GET teacher by id', (done) => {

            Teacher.insertMany(mock[3], function (err, inserted) {
                chai.request(server)
                    .get(`/admin/teachers/${mock[3].id}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        const tchr = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Teacher retrieved successfully');

                        tchr.should.be.a('object');

                        tchr.id.should.eq(mock[3].id);
                        tchr.should.have.property('name');
                        tchr.name.should.have.property('last');
                        tchr.name.should.have.property('first');
                        tchr.should.have.property('type');
                        tchr.type.should.eq('teacher');
                        tchr.should.have.property('fullName');

                        tchr.should.have.property('username');

                        tchr.should.not.have.property('password');

                        done();
                    });
            });

        });
    });


    describe('/POST Teacher', () => {
        it('it should create a new teacher', (done) => {
            chai.request(server)
                .post(`/admin/teachers`)
                .set('Authorization', mockToken.admin)
                .send(mock[3])
                .end((err, res) => {
                    const tchr = res.body.data;
                    res.should.have.status(200);
                    res.body.message.should.eq('Teacher created successfully');
                    tchr.should.be.a('object');
                    tchr.id.should.eq(mock[3].id);
                    tchr.should.have.property('name');
                    tchr.name.should.have.property('last');
                    tchr.name.should.have.property('first');
                    tchr.should.have.property('fullName');
                    tchr.should.have.property('username');
                    tchr.should.have.property('password');
                    tchr.should.have.property('type');
                    tchr.type.should.eq('teacher');

                    bcrypt.compare(mock[3].password, tchr.password, function (err, re) {
                        re.should.eq(true);
                    });



                    done();
                });
        });
    });

    describe('/PUT Teacher', () => {
        it('it should  update teacher', (done) => {
            Teacher.insertMany(mock[3], function (err, inserted) {
                let teacher = JSON.parse(JSON.stringify(mock[3]));;
                let oldUsername = teacher.username;
                teacher.name.first = teacher.name.first + "-updated"
                teacher.name.last = teacher.name.last + "-updated"
                teacher.username = teacher.username + "-updated"
                teacher.password = teacher.password + "-updated"

                chai.request(server)
                    .put(`/admin/teachers`)
                    .set('Authorization', mockToken.admin)
                    .send(teacher)
                    .end((err, res) => {
                        const tchr = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Teacher updated successfully');
                        tchr.should.be.a('object');
                        tchr.id.should.eq(mock[3].id);
                        tchr.should.have.property('name');
                        tchr.name.should.have.property('last');
                        tchr.name.should.have.property('first');
                        tchr.should.have.property('type');
                        tchr.type.should.eq('teacher');
                        tchr.should.have.property('fullName');
                        tchr.should.have.property('username');
                        tchr.should.not.have.property('password');

                        tchr.name.last.should.eq(teacher.name.last);
                        tchr.name.first.should.eq(teacher.name.first);

                        // so the username and password are not editble from here
                        tchr.username.should.eq(oldUsername);
                        done();
                    });
            });
        });
    });

    describe('/DELETE Teacher by id', () => {
        it('it should Delete teacher by id', (done) => {

            Teacher.insertMany(mock[3], function (err, inserted) {
                chai.request(server)
                    .delete(`/admin/teachers/${mock[3].id}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        const tchr = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Teacher deleted successfully');
                        tchr.should.be.a('object');
                        tchr.id.should.eq(mock[3].id);
                        done();
                    });
            });

        });
    });

    after((done) => {
        Teacher.deleteMany({}, (err) => {
            done();
        });
    });

});
