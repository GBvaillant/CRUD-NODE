const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const port = 5500
const mongoose = require('mongoose')
const admin = require('./src/router/admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//configs

app.use(express.json())

//mongoose
mongoose.Promise = global.Promise
mongoose.connect(`mongodb://${process.env.USER_DB}:${process.env.PASSWORD_DB}@ac-lgtibia-shard-00-00.efgtnia.mongodb.net:27017,ac-lgtibia-shard-00-01.efgtnia.mongodb.net:27017,ac-lgtibia-shard-00-02.efgtnia.mongodb.net:27017/?ssl=true&replicaSet=atlas-c9jsrd-shard-0&authSource=admin&retryWrites=true&w=majority
`).then(() => {
    console.log('Conectado ao banco de dados com sucesso')
}).catch((err) => {
    console.log('error: ' + err)
})

app.use(admin)

app.listen(port, () => {
    console.log('Servidor rodando na porta ' + port)
})


