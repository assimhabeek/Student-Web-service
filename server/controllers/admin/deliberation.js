/* eslint-disable class-methods-use-this */

import Deliberation from '../../models/deliberations-model';
import answer from '../../utils/answer';
import Mark from '../../models/marks-model';
import Course from '../../models/courses-model';

class DeliberationsController {

    constructor() {
        // binding handlers to use class props 
        this.findAll = this.findAll.bind(this);
        this.find = this.find.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
    }

    findAll(req, res) {
        const isPaginationRequired = req.query.page && req.query.pageSize;
        const isSortRequired = req.query.sort && req.query.sortDir;
        const isFilterRequired = req.query.filter;
        let searchQuery = {};

        if (isFilterRequired) {
            searchQuery['$text'] = { $search: req.query.filter };
        }


        Deliberation.countDocuments(searchQuery, (er, count) => {
            if (er)
                answer(res, 500, false, 'The server could not handle the request.', er);
            else {
                let query = Deliberation.find(searchQuery);
                let resBody = {
                    pageIndex: 1,
                    pageSize: -1,
                    sort: null,
                    sortDir: 0,
                    filter: null,
                    total: count
                };

                if (isSortRequired) {
                    query = query.sort({ [req.query.sort]: +req.query.sortDir });
                    resBody.sort = req.query.sort;
                    resBody.sortDir = req.query.sortDir;
                }

                if (isPaginationRequired) {
                    const pageSize = +req.query.pageSize;
                    const page = +req.query.page;
                    query = query.skip((page - 1) * pageSize).limit(pageSize);
                    resBody.pageIndex = page;
                    resBody.pageSize = pageSize;
                }

                query = query.populate('student').populate('course');
                query.exec((error, deliberations) => {
                    if (error)
                        answer(res, 500, false, 'The server could not handle the request.', error);
                    else {
                        resBody.records = deliberations;
                        answer(res, 200, true, `Deliberations retrieved successfully`, resBody);
                    }
                })
            }

        });
    }



    find(req, res) {
        const id = req.params.id;
        Deliberation.findOne({ _id: id }).populate('student').exec(function (error, crs) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                answer(res, 200, true, `Deliberation retrieved successfully`, crs);
        })
    }

    create(req, res) {
        const newCourse = req.body;
        // force the type to be the same as the type of the used controller 

        // presiste Deliberation to the database
        Deliberation.create(newCourse, function (error, crs) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                Deliberation.populate(crs, { path: "student" }, function (err, newCrs) {

                    if (err)
                        answer(res, 500, false, 'The server could not handle the request.', err);
                    else
                        answer(res, 200, true, `Deliberation created successfully`, newCrs);
                });
        });

    }


    update(req, res) {
        const updatedCourse = req.body;
        Deliberation.findOneAndUpdate({ _id: updatedCourse._id }, updatedCourse, { new: true, useFindAndModify: false }, (error, crs) => {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                Deliberation.populate(crs, { path: "student" }, function (err, newCrs) {

                    if (err)
                        answer(res, 500, false, 'The server could not handle the request.', err);
                    else
                        answer(res, 200, true, `Deliberation updated successfully`, newCrs);
                });

        })

    }

    remove(req, res) {
        const id = req.params.id;

        Deliberation.findOneAndRemove({ _id: id }, { useFindAndModify: false }, function (error, data) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                answer(res, 200, true, `Deliberation deleted successfully`, data);
        })
    }

    autoGenerate(req, res) {
        Deliberation.deleteMany({}, function (error, deleted) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                Mark.find({}).populate('course').exec(function (err, marks) {

                    if (err)
                        answer(res, 500, false, 'The server could not handle the request.', err);
                    else {
                        Course.countDocuments({ 'unit': 1 }, function (errr, unit1Count) {
                            Course.countDocuments({ 'unit': 2 }, function (er, unit2Count) {
                                Course.countDocuments({ 'unit': 3 }, function (errrr, unit3Count) {
                                    const dlrs = marks.reduce((p, cur, curInd, array) => {
                                        if (cur.course) {
                                            let mark = { unit: cur.course.unit, mark: cur.mark };
                                            const student = p.find(x => String(x.student) === String(cur.student));
                                            if (student) {
                                                student.marks.push(mark);
                                            } else {
                                                p.push({ student: cur.student, marks: [mark] });
                                            }
                                        }
                                        return p;
                                    }, [])
                                        .map(x => {
                                            let y = { student: x.student };
                                            y.unit1 = x.marks.filter(z => z.unit === 1).reduce((o, x) => o + x.mark, 0) / (unit1Count > 0 ? unit1Count : 1);
                                            y.unit2 = x.marks.filter(z => z.unit === 2).reduce((o, x) => o + x.mark, 0) / (unit2Count > 0 ? unit2Count : 1);
                                            y.unit3 = x.marks.filter(z => z.unit === 3).reduce((o, x) => o + x.mark, 0) / (unit3Count > 0 ? unit3Count : 1);
                                            return new Deliberation(y);
                                        });

                                    Deliberation.insertMany(dlrs, function (e, r) {
                                        if (e)
                                            answer(res, 500, false, 'The server could not handle the request.', e);
                                        else
                                            answer(res, 200, true, `Deliberations created successfully`, { count: dlrs.length });
                                    });
                                });
                            });
                        });
                    }
                });
        });
    }

    getUnitSum(x, unit) {
        return x.marks.filter(z => z.unit === unit).reduce((o, x) => o + x.mark, 0) ?
            x.marks.filter(z => z.unit === unit).reduce((o, x) => o + x.mark, 0) : 0;
    }
}

export default DeliberationsController;
