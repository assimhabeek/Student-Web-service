/* eslint-disable class-methods-use-this */

import answer from '../../utils/answer';
import Mark from '../../models/marks-model';


class MarksController {


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


        Mark.countDocuments(searchQuery, (er, count) => {
            if (er)
                answer(res, 500, false, 'The server could not handle the request.', er);
            else {
                let query = Mark.find(searchQuery);
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
                query.exec((error, marks) => {
                    if (error)
                        answer(res, 500, false, 'The server could not handle the request.', error);
                    else {
                        resBody.records = marks;
                        answer(res, 200, true, `Marks retrieved successfully`, resBody);
                    }
                })
            }

        });
    }



    find(req, res) {
        const id = req.params.id;
        Mark.findOne({ _id: id }).populate('student').populate('course').exec(function (error, mrk) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                answer(res, 200, true, `Mark retrieved successfully`, mrk);
        })
    }

    create(req, res) {
        const newCourse = req.body;
        // force the type to be the same as the type of the used controller 

        // presiste Course to the database
        Mark.create(newCourse, function (error, crs) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                Mark.populate(crs, { path: 'student' }, function (err, newMrk) {

                    if (err)
                        answer(res, 500, false, 'The server could not handle the request.', err);
                    else
                        Mark.populate(newMrk, { path: 'course' }, function (e, finalMrk) {
                            if (e)
                                answer(res, 500, false, 'The server could not handle the request.', e);
                            else
                                answer(res, 200, true, `Mark created successfully`, finalMrk);
                        })
                });
        });

    }

    update(req, res) {
        const updatedCourse = req.body;
        Mark.findOneAndUpdate({ _id: updatedCourse._id }, updatedCourse, { new: true, useFindAndModify: false }, (error, mrk) => {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                Mark.populate(mrk, { path: 'student' }, function (err, newMrk) {

                    if (err)
                        answer(res, 500, false, 'The server could not handle the request.', err);
                    else
                        Mark.populate(newMrk, { path: 'course' }, function (e, finalMrk) {
                            if (e)
                                answer(res, 500, false, 'The server could not handle the request.', e);
                            else
                                answer(res, 200, true, `Mark updated successfully`, finalMrk);
                        })

                });

        })

    }

    remove(req, res) {
        const id = req.params.id;

        Mark.findOneAndRemove({ _id: id }, { useFindAndModify: false }, function (error, data) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                answer(res, 200, true, `Mark deleted successfully`, data);
        })
    }

}

export default MarksController;
