/* eslint-disable class-methods-use-this */

import Course from '../../models/courses-model';
import answer from '../../utils/answer';
import auth from '../auth';


class CoursesController {

    constructor() {
        // binding handlers to use class props 
        this.findAll = this.findAll.bind(this);
        this.find = this.find.bind(this);
    }


    findAll(req, res) {
        const usr = auth.user(req);
        const isPaginationRequired = req.query.page && req.query.pageSize;
        const isSortRequired = req.query.sort && req.query.sortDir;
        const isFilterRequired = req.query.filter;
        let searchQuery = { teacher: usr.id };

        if (isFilterRequired) {
            searchQuery['$text'] = { $search: req.query.filter };
        }


        Course.count(searchQuery, (er, count) => {
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
        const usr = auth.user(req);
        Course.findOne({ _id: id, teacher: usr.id }).populate('teacher').exec(function (error, crs) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                answer(res, 200, true, `Course retrieved successfully`, crs);
        })
    }



}

export default CoursesController;
