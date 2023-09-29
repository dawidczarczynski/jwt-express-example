const authService = require('./auth.service');
const usersDao = require('../users/users.dao');

const extractTokenFromHeaders = (headers) => {
    return headers.authorization?.replace('Bearer ', '');
};

const authMiddleware = async (req, res, next) => {
    try {
        const token = extractTokenFromHeaders(req.headers);

        if (!token) {
            throw new Error('Authorization token is missing.')
        }

        const { username } = authService.verifyToken(token);
        const userEntity = await usersDao.getUser(username);

        if (!userEntity || userEntity.token !== token) {
            throw new Error('Token is invalid.')
        }

        req.user = userEntity;
        return next();
    } catch (e) {
        return res.status(401).send({ message: e.message });
    }
};

module.exports = {
    authMiddleware,
};