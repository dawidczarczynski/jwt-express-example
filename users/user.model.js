const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
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
    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: { 
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

