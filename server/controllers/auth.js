/* eslint-disable class-methods-use-this */
import answer from '../utils/answer';
import User from '../models/users-model';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import bcrypt from 'bcrypt';

class authController {

    login(req, res) {

        const user = req.body;

        User.findOne({ username: user.username }).select('_id username password type name').exec(function (err, result) {
            if (err)
                answer(res, 500, false, 'The server could not handle the request.', err);

            if (!result)
                answer(res, 404, false, "User not found !", []);
            else
                bcrypt.compare(user.password, result.password).then(function (match) {
                    if (match)
                        answer(res, 200, true, "LoggedIn successfully !", { token: jwt.sign({ id: result.id, name: result.name, username: result.username, type: result.type }, config.apiKey) });
                    else
                        answer(res, 404, false, "Wrong username or password !", {});
                });

        });
    }

    user(req) {
        return jwt.verify(req.headers.authorization, config.apiKey);
    }

    isLoggedIn(req, res, next) {
        if (!req.headers.authorization) {
            answer(res, 200, true, "The user is not loggedIn !", null);
        } else {
            try {
                const decoded = jwt.verify(req.headers.authorization, config.apiKey);
                answer(res, 200, true, "The user is loggedIn !", decoded);
            } catch (e) {
                answer(res, 200, true, "The user is not loggedIn !", null);
            }
        }
    }


    isAdmin(req, res, next) {
        if (req.method == "OPTIONS") {
            answer(res, 200, true, "", {});
        } else
            if (!req.headers.authorization) {
                answer(res, 403, false, "No credentials sent!", {});
            } else {
                try {
                    const decoded = jwt.verify(req.headers.authorization, config.apiKey);
                    if (decoded.type != 'admin')
                        answer(res, 401, false, "You are not authorized to use this resource !", {});
                    else
                        next();
                } catch (e) {
                    answer(res, 401, false, "Token is invalid", e);
                }
            }
    }

    isTeacher(req, res, next) {
        if (req.method == "OPTIONS") {
            answer(res, 200, true, "", {});
        } else
            if (!req.headers.authorization) {
                answer(res, 403, false, "No credentials sent!", {});
            } else {
                try {
                    const decoded = jwt.verify(req.headers.authorization, config.apiKey);
                    if (decoded.type != 'teacher')
                        answer(res, 401, false, "You are not authorized to use this resource !", {});
                    else
                        next();
                } catch (e) {
                    answer(res, 401, false, "Token is invalid", e);
                }

            }
    }

    isStudent(req, res, next) {
        if (req.method == "OPTIONS") {
            answer(res, 200, true, "", {});
        } else
            if (!req.headers.authorization) {
                answer(res, 403, false, "No credentials sent!", {});
            } else {
                try {
                    const decoded = jwt.verify(req.headers.authorization, config.apiKey);
                    if (decoded.type != 'student')
                        answer(res, 401, false, "You are not authorized to use this resource !", {});
                    else
                        next();
                } catch (e) {
                    answer(res, 401, false, "Token is invalid", e);
                }

            }
    }

}

const auth = new authController();
export default auth;
