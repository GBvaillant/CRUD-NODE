const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.use((req, res, next) => {
    console.log('date: ' + new Date())

    next()
});

router.post('/user', async (req, res) => {
    try {
        const novoUser = await User.create({
            nome: req.body.nome,
            email: req.body.email,
            senha: req.body.senha
        })
        res.status(201).json(novoUser)
        console.log('Usuário criado')

    } catch (err) {
        res.status(500).send(err.message)
    }
});

router.get('/user', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});

router.patch('/user/:id', async (req, res) => {
    try {
        const id = req.params.id
        const editUser = await User.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(editUser)
        console.log('Usuário editado')
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});

router.delete('/user/:id', async (req, res) => {
    try {
        const id = req.params.id
        const deleteUser = await User.findByIdAndRemove(id)
        res.status(200).json(deleteUser)
        console.log('Usuário deletado')
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});



module.exports = router