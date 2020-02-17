/* eslint-disable class-methods-use-this */

import User from '../../models/users-model';
import bcrypt from 'bcrypt';
import config from '../../config/config';
import answer from '../../utils/answer';

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
};

class usersController {

    constructor(type) {
        this.type = type;

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
        let searchQuery = { type: this.type };

        if (isFilterRequired) {
            searchQuery['$text'] = { $search: req.query.filter };
        }

        User.countDocuments(searchQuery, (er, count) => {
            if (er)
                answer(res, 500, false, 'The server could not handle the request.', er);
            else {
                let query = User.find(searchQuery);
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

                query.exec((error, users) => {
                    if (error)
                        answer(res, 500, false, 'The server could not handle the request.', error);
                    else {
                        resBody.records = users;
                        answer(res, 200, true, `${capitalize(this.type)}s retrieved successfully`, resBody);
                    }
                })
            }

        });
    }

    find(req, res) {
        const id = req.params.id;
        User.findOne({ _id: id, type: this.type })
            .exec((error, user) => {
                if (error)
                    answer(res, 500, false, 'The server could not handle the request.', error);
                else
                    answer(res, 200, true, `${capitalize(this.type)} retrieved successfully`, user);
            })
    }

    create(req, res) {
        const user = req.body;
        // force the type to be the same as the type of the used controller 
        user.type = this.type;
        // encrypte the password and store the user
        bcrypt.hash(user.password, config.saltRounds, (err, hash) => {
            if (err)
                answer(res, 500, false, 'The server could not handle the request.', err);
            else {
                // replace password with the encrypted one    
                user.password = hash;

                // presiste user to the database
                User.create(user, (error, std) => {
                    if (error)
                        answer(res, 500, false, 'The server could not handle the request.', error);

                    answer(res, 200, true, `${capitalize(this.type)} created successfully`, std);
                });
            }
        });

    }

    update(req, res) {
        let updatedUser = req.body;

        if (updatedUser.type == this.type) {

            // we prevent the change of username and password by deleting theme
            delete updatedUser.password;
            delete updatedUser.username;

            User.findOneAndUpdate({ _id: updatedUser._id, type: this.type }, updatedUser, { new: true, useFindAndModify: false }, (error, std) => {
                if (error)
                    answer(res, 500, false, 'The server could not handle the request.', error);
                else
                    answer(res, 200, true, `${capitalize(this.type)} updated successfully`, std);
            })
        } else {
            answer(res, 401, false, "The user type doesn't match the resource type", {});
        }
    }

    remove(req, res) {
        const id = req.params.id;
        User.findOneAndRemove({ _id: id, type: this.type }, { useFindAndModify: false, new: true }, (error, data) => {
            if (error)
                answer(res, 500, false, 'The server could not handle the request.', error);
            else
                answer(res, 200, true, `${capitalize(this.type)} deleted successfully`, data);
        })
    }

}

export default usersController;
