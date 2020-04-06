const {Schema, model} = require('mongoose')

const schema = new Schema({
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    surname: {
        type: String
    }
})

module.exports = model('Comment', schema)