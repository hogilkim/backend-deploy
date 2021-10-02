const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    resetPasswordLink:{
        data: String,
        default: ''
    },
    userType: { type: String, default: "CUSTOMER"}
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);