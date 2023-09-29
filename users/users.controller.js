const userDao = require('./users.dao');
const authService = require('../auth/auth.service');

const signupHandler = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const createdUser = await userDao.createUser({ username, password });

        return res.status(201).send({
            user: {
                username: createdUser.username,
                role: createdUser.role,
            },
        });
    } catch (e) {
        const { message } = e;

        if (e instanceof userDao.DuplicatedKeyError) {
            return res.status(409).send({ message });
        }

        return next(e); 
    }
};

const loginHandler = async (req, res, next) => {
    try {
        const userEntity = await userDao.getUser(req.body.username);
        const isUserPasswordValid = await userEntity.validatePassword(req.body.password);
        if (!userEntity || !isUserPasswordValid) {
            return res.status(401).send({ message: 'Wrong credentials.' })
        }

        const userPayload = {
            username: userEntity.username,
            role: userEntity.role,
        };

        const token = authService.generateAccessToken(userPayload);
        await userDao.updateUser(userEntity.username, { token });

        return res.status(200).send({ 
            user: userPayload,
            token,
        });
    } catch (e) {
        return next(e);
    }
};

const logoutHandler = async (req, res, next) => {
    try {
        const { username } = req.user;
        await userDao.updateUser(username, { token: null });

        return res.status(204).send();
    } catch (e) {
        return next(e);
    }
};

const currentHandler = async (req, res, next) => {
    try {
        const { username, role } = req.user;
        return res.status(200).send({ user: { username, role }});
    } catch (e) {
        return next(e);
    }
};


module.exports = {
    signupHandler,
    loginHandler,
    logoutHandler,
    currentHandler
};

