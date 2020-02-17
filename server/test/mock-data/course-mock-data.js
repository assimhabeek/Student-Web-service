import Course from '../../models/courses-model';
import mongoose from 'mongoose';
import mockIds from './mockIds';

const courses = [
    new Course({
        _id: mockIds.courses.first,
        abb: 'C01',
        name: 'Course 01',
        description: 'Course 01 description',
        unit: 1,
        teacher: mockIds.teachers.first,
    }),
    new Course({
        _id: mockIds.courses.second,
        abb: 'C02',
        name: 'Course 02',
        description: 'Course 02 description',
        unit: 2,
        teacher: mockIds.teachers.first,
    }),
    new Course({
        _id: mockIds.courses.thired,
        abb: 'C03',
        name: 'Course 03',
        description: 'Course 03 description',
        unit: 3,
        teacher: mockIds.teachers.first,
    }),
    new Course({
        _id: mockIds.courses.fourth,
        abb: 'C04',
        name: 'Course 04',
        description: 'Course 04 description',
        unit: 1,
        teacher: mockIds.teachers.second
    })

];




export default courses;