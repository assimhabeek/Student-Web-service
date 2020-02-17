import jwt from 'jsonwebtoken';
import mock from './user-mock-data';
import config from '../../config/config';

const tokens = {
    admin: jwt.sign({ id: mock[4].id, name: mock[4].name, username: mock[4].username, type: mock[4].type }, config.apiKey),
    student: jwt.sign({ id: mock[0].id, name: mock[0].name, username: mock[0].username, type: mock[0].type }, config.apiKey),
    teacher: jwt.sign({ id: mock[2].id, name: mock[2].name, username: mock[2].username, type: mock[2].type }, config.apiKey)
}

export default tokens;