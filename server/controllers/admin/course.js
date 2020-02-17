/* eslint-disable class-methods-use-this */

import Course from '../../models/courses-model';
import answer from '../../utils/answer';


class CoursesController {

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


        Course.countDocuments(searchQuery, (er, count) => {
            if (er)
                answer(res, 500, false, 'The server could not handle the request.', er);
            else {
                let query = Course.find(searchQuery);
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

                query = query.populate('teacher');
                query.exec((error, courses) => {
                    if (error)
                        answer(res, 500, false, 'The server could not handle the request.', error);
                    else {
                        resBody.records = courses;
                        answer(res, 200, true, `Courses retrieved successfully`, resBody);
                    }
                })
            }

        });
    }


    find(req, res) {
        const id = req.params.id;
        Course.findOne({ _id: id }).populate('teacher').exec(function (error, crs) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                answer(res, 200, true, `Course retrieved successfully`, crs);
        })
    }

    create(req, res) {
        const newCourse = req.body;
        // force the type to be the same as the type of the used controller 

        // presiste Course to the database
        Course.create(newCourse, function (error, crs) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                Course.populate(crs, { path: "teacher" }, function (err, newCrs) {

                    if (err)
                        answer(res, 500, false, 'The server could not handle the request.', err);

                    answer(res, 200, true, `Course created successfully`, newCrs);
                });
        });

    }

    update(req, res) {
        const updatedCourse = req.body;
        Course.findOneAndUpdate({ _id: updatedCourse._id }, updatedCourse, { new: true, useFindAndModify: false }, (error, crs) => {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                Course.populate(crs, { path: "teacher" }, function (err, newCrs) {

                    if (err)
                        answer(res, 500, false, 'The server could not handle the request.', err);
                    else
                        answer(res, 200, true, `Course updated successfully`, newCrs);
                });

        })

    }

    remove(req, res) {
        const id = req.params.id;

        Course.findOneAndRemove({ _id: id }, { useFindAndModify: false }, function (error, data) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                answer(res, 200, true, `Course deleted successfully`, data);
        })
    }

}

export default CoursesController;
