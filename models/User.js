const {Schema, model} = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
    },
    surname: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = model('User', schema);