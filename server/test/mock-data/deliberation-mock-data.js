import Deliberation from '../../models/deliberations-model';
import mockIds from './mockIds';

const deliberations = [
    new Deliberation({
        _id: mockIds.deliberations.first,
        unit1: 17.0,
        unit2: 4.1,
        unit3: 9.1,
        student: mockIds.students.first,
        complain: 'this is a complain'
    }),
    new Deliberation({
        _id: mockIds.deliberations.second,
        unit1: 16.7,
        unit2: 11.6,
        unit3: 10.1,
        student: mockIds.students.second,
    }),
    new Deliberation({
        _id: mockIds.deliberations.thired,
        unit1: 13.6,
        unit2: 14.9,
        unit3: 11.13,
        student: mockIds.students.thired,
    }),
    new Deliberation({
        _id: mockIds.deliberations.fourth,
        unit1: 19.6,
        unit2: 11.5,
        unit3: 13.4,
        student: mockIds.students.fourth,
        complain: 'this is a complain'
    })

];


export default deliberations;