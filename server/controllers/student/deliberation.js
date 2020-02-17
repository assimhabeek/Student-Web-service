/* eslint-disable class-methods-use-this */

import Deliberation from '../../models/deliberations-model';
import answer from '../../utils/answer';
import auth from '../auth';

class DeliberationsController {

    constructor() {
        // binding handlers to use class props 
        this.findAll = this.findAll.bind(this);
        this.find = this.find.bind(this);
    }

    findAll(req, res) {
        const isPaginationRequired = req.query.page && req.query.pageSize;
        const isSortRequired = req.query.sort && req.query.sortDir;
        const isFilterRequired = req.query.filter;
        let usr = auth.user(req);
        let searchQuery = { student: usr.id };

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
        let usr = auth.user(req);
        const id = req.params.id;
        Deliberation.findOne({ _id: id, student: usr.id }).populate('student').exec(function (error, crs) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);

            answer(res, 200, true, `Deliberation retrieved successfully`, crs);
        })
    }

    complain(req, res) {
        let usr = auth.user(req);
        const complaint = req.body;
        Deliberation.findById(complaint.id, function (error, dlr) {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else if (!dlr.id)
                answer(res, 404, false, 'The deliberation was not found !', []);
            else {
                dlr.complain = complaint.complain;
                dlr.isComplainHandled = false;
                dlr.save(function (err) {
                    if (err)
                        answer(res, 500, false, 'The server could not handle the request.', error);
                    else
                        answer(res, 200, true, 'The complaint is added !', dlr);
                });
            }
        })
    }

}

export default DeliberationsController;
