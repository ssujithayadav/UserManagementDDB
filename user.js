const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
 passwordSchema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: validator.isAlphanumeric
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{ type: String }],
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    next();
});

userSchema.methods.comparePassword = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
};


const User = mongoose.model('User', userSchema);


module.exports = {
    User,
    passwordSchema
}
