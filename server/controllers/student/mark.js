/* eslint-disable class-methods-use-this */

import answer from '../../utils/answer';
import Mark from '../../models/marks-model';
import auth from '../auth';


class MarksController {


    constructor() {
        // binding handlers to use class props 
        this.findAll = this.findAll.bind(this);
        this.find = this.find.bind(this);
    }

    findAll(req, res) {
        const isPaginationRequired = req.query.page && req.query.pageSize;
        const isSortRequired = req.query.sort && req.query.sortDir;
        const isFilterRequired = req.query.filter;
        const usr = auth.user(req);
        let searchQuery = { student: usr.id };

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
        const usr = auth.user(req);
        Mark.findOne({ _id: id, student: usr.id }).populate('student').populate('course').exec(function (error, mrk) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                answer(res, 200, true, `Mark retrieved successfully`, mrk);
        })
    }

    complain(req, res) {
        const usr = auth.user(req);
        const complaint = req.body;
        Mark.findById(complaint.id, function (error, mrk) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else if (!mrk.id)
                answer(res, 404, false, 'The mark was not found !', []);
            else {
                mrk.complain = complaint.complain;
                mrk.isComplainHandled = false;
                mrk.save(function (err) {
                    if (err)
                        answer(res, 500, false, 'The server could not handle the request.', error);
                    else
                        answer(res, 200, true, 'The complaint is added !', mrk);
                });
            }
        })
    }

}

export default MarksController;
