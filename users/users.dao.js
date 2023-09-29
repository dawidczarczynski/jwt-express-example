const { User } = require("./user.model");

class DuplicatedKeyError extends Error {
    constructor(keyName, value) {
        super(`${keyName} has to be unique. ${value} is already taken.`);
    }
}

class UnknownDatabaseError extends Error {
    constructor() {
        super('Oops, something went wrong at database layer.');
    }
}

const createUser = async (userData) => {
    try {
        return await User.create(userData);
    } catch (e) {
        console.error(e);
 
        if (e.code === 11000) {
            const [[ key, value ]] = Object.entries(e.keyValue);
            throw new DuplicatedKeyError(key, value);
        }

        throw new UnknownDatabaseError();
    }
};

const getUser = async (username) => {
    try {
        return await User.findOne({ username });
    } catch (e) {
        console.error(e);
        throw new UnknownDatabaseError();
    }
};

const updateUser = async (username, userData) => {
    try {
        return await User.findOneAndUpdate({ username }, userData);
    } catch (e) {
        console.error(e);
        throw new UnknownDatabaseError();
    }
}


module.exports = {
    createUser,
    getUser,
    updateUser,
    DuplicatedKeyError,
    UnknownDatabaseError,
};
