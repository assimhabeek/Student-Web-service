import User from '../../models/users-model';
import bcrypt from 'bcrypt';
import config from '../../config/config';
import mongoose from 'mongoose';
import mockIds from './mockIds';


const users = [
    new User({
        _id: mockIds.students.first,
        name: {
            last: 'user-1-last',
            first: 'user-1-first',
        },
        username: 'user-1-username',
        password: 'user-1-password',
        type: 'student'
    }),
    new User({
        _id: mockIds.students.second,
        name: {
            last: 'user-2-last',
            first: 'user-2-first',
        },
        username: 'user-2-username',
        password: 'user-2-password',
        type: 'student',
    }),
    new User({
        _id: mockIds.teachers.first,
        name: {
            last: 'user-3-last',
            first: 'user-3-first',
        },
        username: 'user-3-username',
        password: 'user-3-password',
        type: 'teacher'
    }),
    new User({
        _id: mockIds.teachers.second,
        name: {
            last: 'user-4-last',
            first: 'user-4-first',
        },
        username: 'user-4-username',
        password: 'user-4-password',
        type: 'teacher'
    }),
    new User({
        _id: mockIds.admins.first,
        name: {
            last: 'user-5-last',
            first: 'user-5-first',
        },
        username: 'user-5-username',
        password: 'user-5-password',
        type: 'admin'
    }),
    new User({
        _id: mockIds.admins.second,
        name: {
            last: 'user-6-last',
            first: 'user-6-first',
        },
        username: 'user-6-username',
        password: 'user-6-password',
        type: 'admin'
    }),
    new User({
        _id: mockIds.admins.thired,
        name: {
            last: 'user-7-last',
            first: 'user-7-first',
        },
        username: 'user-7-username',
        password: 'user-7-password',
        type: 'admin'
    }),
    new User({
        _id: mockIds.admins.fourth,
        name: {
            last: 'user-8-last',
            first: 'user-8-first',
        },
        username: '9-user-8-username',
        password: 'user-8-password',
        type: 'admin'
    }),
    new User({
        _id: mockIds.admins.fifth,
        name: {
            last: 'user-9-last',
            first: 'user-9-first',
        },
        username: 'user-9-username',
        password: 'user-9-password',
        type: 'admin'
    })
];

for (let index = 0; index < users.length; index++) {
    bcrypt.hash(users[index].password, config.saltRounds, function (err, hash) {
        users[index].password = hash;
    })
}


export default users;