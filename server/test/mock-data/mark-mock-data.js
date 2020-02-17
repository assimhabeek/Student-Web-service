import Mark from '../../models/marks-model';
import mongoose from 'mongoose';
import mockIds from './mockIds';

const marks = [
    new Mark({
        _id: mockIds.marks.first,
        mark : 19.0,
        student: mockIds.students.first,
        course: mockIds.courses.first,
        complain : 'this is a complain'
    }),
    new Mark({
        _id: mockIds.marks.second,
        mark : 12.0,
        student: mockIds.students.first,
        course: mockIds.courses.second,
    }),
    new Mark({
        _id: mockIds.marks.thired,
        mark : 13.0,
        student: mockIds.students.first,
        course: mockIds.courses.thired,
    }),
    new Mark({
        _id: mockIds.marks.fourth,
        mark : 10.0,
        student: mockIds.students.second,
        course: mockIds.courses.fourth,
        complain : 'this is a complain'
    })
];




export default marks;