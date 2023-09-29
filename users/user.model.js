const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ["user", "superuser"],
        default: "user",
    },
    token: {
        type: String,
        default: null,
    },
});

userSchema.pre('save', async function() {
    if (!this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = new mongoose.model('users', userSchema);

module.exports = {
    User,
};

