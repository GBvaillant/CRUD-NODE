const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    }
})

const User = mongoose.model('Users', user)

module.exports = User