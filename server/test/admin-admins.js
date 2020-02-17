import Admin from '../models/users-model';
import mock from './mock-data/user-mock-data';
import mockToken from './mock-data/mockTokens';
//Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
const should = chai.should();
import bcrypt from 'bcrypt';
require('../utils/isSorted');

chai.use(chaiHttp);

describe('Admins', () => {

    beforeEach((done) => {
        //Before each test we empty the database
        Admin.deleteMany({}, (err) => {
            done();
        });
    });


    describe('/GET Admins', () => {
        it('it should GET all the admins', (done) => {
            Admin.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/admin/admins')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Admins retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(5);
                        res.body.data.pageIndex.should.be.eql(1);
                        res.body.data.pageSize.should.be.eql(-1);
                        done();
                    });
            });

        });
    });

    describe('/GET Admins', () => {
        it('it should get admins by page', (done) => {
            Admin.insertMany(mock, function (err, inserted) {
                chai.request(server)
                    .get('/admin/admins?page=1&pageSize=2')
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Admins retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.should.be.a('array');
                        res.body.data.records.length.should.eql(2);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(2);
                        res.body.data.total.should.eq(5);
                        done();
                    });
            });
        });
    });

    describe('/GET Admins', () => {
        it('it should get admins by page and sort them by last name', (done) => {
            Admin.insertMany(mock, function (err, inserted) {
                const sort = 'name.last';
                const sortDir = 1;
                chai.request(server)
                    .get(`/admin/admins?page=1&pageSize=2&sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Admins retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.should.be.a('array');
                        res.body.data.records.length.should.eql(2);
                        res.body.data.records.map(x => x.name.last).isSorted().should.eq(sortDir);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(2);
                        res.body.data.total.should.eq(5);
                        done();
                    });
            });
        });
    });

    describe('/GET Admins', () => {
        it('it should get admins that his name contains 9 by page and sort them by last name', (done) => {
            Admin.insertMany(mock, function (err, inserted) {
                const sort = 'name.last';
                const sortDir = 1;
                chai.request(server)
                    .get(`/admin/admins?page=1&pageSize=2&sort=${sort}&sortDir=${sortDir}&filter=9`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Admins retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.records.should.be.a('array');
                        res.body.data.records.length.should.eql(2);
                        res.body.data.records.map(x => x.name.last).isSorted().should.eq(sortDir);
                        res.body.data.pageIndex.should.eq(1);
                        res.body.data.pageSize.should.eq(2);
                        res.body.data.total.should.eq(2);
                        done();
                    });
            });
        });
    });


    describe('/GET Admins', () => {
        it('it should get admins and sort them by last name', (done) => {
            Admin.insertMany(mock, function (err, inserted) {
                const sort = 'name.last';
                const sortDir = -1;
                chai.request(server)
                    .get(`/admin/admins?sort=${sort}&sortDir=${sortDir}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.message.should.eq('Admins retrieved successfully');
                        res.body.data.should.be.a('object');
                        res.body.data.total.should.be.eql(5);
                        res.body.data.pageIndex.should.be.eql(1);
                        res.body.data.pageSize.should.be.eql(-1);
                        res.body.data.records.map(x => x.name.last).isSorted().should.eq(sortDir);
                        done();
                    });
            });
        });
    });


    describe('/GET Admin by id', () => {
        it('it should GET admins by id', (done) => {

            Admin.insertMany(mock[4], function (err, inserted) {
                chai.request(server)
                    .get(`/admin/admins/${mock[4].id}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        const admn = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Admin retrieved successfully');
                        admn.should.be.a('object');
                        admn.id.should.eq(mock[4].id);
                        admn.should.have.property('name');
                        admn.name.should.have.property('last');
                        admn.name.should.have.property('first');
                        admn.should.have.property('type');
                        admn.type.should.eq('admin');
                        admn.should.have.property('fullName');
                        admn.should.have.property('username');
                        admn.should.not.have.property('password');
                        done();
                    });
            });
        });
    });


    describe('/POST Admin', () => {
        it('it should create a new admin', (done) => {
            chai.request(server)
                .post(`/admin/admins`)
                .set('Authorization', mockToken.admin)
                .send(mock[4])
                .end((err, res) => {
                    const admn = res.body.data;
                    res.should.have.status(200);
                    res.body.message.should.eq('Admin created successfully');
                    admn.should.be.a('object');
                    admn.id.should.eq(mock[4].id);
                    admn.should.have.property('name');
                    admn.name.should.have.property('last');
                    admn.name.should.have.property('first');
                    admn.should.have.property('fullName');
                    admn.should.have.property('username');
                    admn.should.have.property('password');
                    admn.should.have.property('type');
                    admn.type.should.eq('admin');

                    bcrypt.compare(mock[4].password, admn.password, function (err, re) {
                        re.should.eq(true);
                    });

                    done();
                });
        });
    });

    describe('/PUT Admin', () => {
        it('it should  update admin', (done) => {
            Admin.insertMany(mock[4], function (err, inserted) {
                let admin = JSON.parse(JSON.stringify(mock[4]));
                let oldUsername = admin.username;
                admin.name.first = admin.name.first + "-updated"
                admin.name.last = admin.name.last + "-updated"
                admin.username = admin.username + "-updated"
                admin.password = admin.password + "-updated"

                chai.request(server)
                    .put(`/admin/admins`)
                    .set('Authorization', mockToken.admin)
                    .send(admin)
                    .end((err, res) => {
                        const admn = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Admin updated successfully');
                        admn.should.be.a('object');
                        admn.id.should.eq(mock[4].id);
                        admn.should.have.property('name');
                        admn.name.should.have.property('last');
                        admn.name.should.have.property('first');
                        admn.should.have.property('fullName');
                        admn.should.have.property('username');
                        admn.should.not.have.property('password');
                        admn.should.have.property('type');
                        admn.type.should.eq('admin');

                        admn.name.last.should.eq(admin.name.last);
                        admn.name.first.should.eq(admin.name.first);

                        // so the username and password are not editble from here
                        admn.username.should.eq(oldUsername);
                        done();
                    });
            });
        });
    });

    describe('/DELETE Admin by id', () => {
        it('it should Delete admins by id', (done) => {

            Admin.insertMany(mock[4], function (err, inserted) {
                chai.request(server)
                    .delete(`/admin/admins/${mock[4].id}`)
                    .set('Authorization', mockToken.admin)
                    .end((err, res) => {
                        const admn = res.body.data;
                        res.should.have.status(200);
                        res.body.message.should.eq('Admin deleted successfully');
                        admn.should.be.a('object');
                        admn.id.should.eq(mock[4].id);
                        done();
                    });
            });

        });
    });

    after((done) => {
        Admin.deleteMany({}, (err) => {
            done();
        });
    });

});

