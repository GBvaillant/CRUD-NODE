const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// Public router
router.get('/', (req, res) => {
    res.status(200).json({ texto: 'Bem Vindo(a)!!' })
})

// Private router
router.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id

    const user = await User.findById(id, '-senha')

    if (!user) {
        return res.status(404).json({ texto: 'Usuário não encontrado' })
    }
    res.status(200).json({ texto: `Bem vindo ${user.nome}!!` })
})
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ texto: 'Acesso negado' })
    }
    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)
        next()

    } catch (err) {
        res.status(400).json({ texto: 'Token inválido' })
    }
}
// Registrar user
router.post('/user', async (req, res) => {
    var erros = []
    const userConfirm = await User.findOne({ email: req.body.email })

    if (typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.length < 3) {
        erros.push({ texto: "Nome inválido" })
    }
    if (!req.body.nome) {
        erros.push({ texto: "Nome obrigatório" })
    }
    if (typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "email inválido" })
    }
    if (!req.body.email) {
        erros.push({ texto: "Email obrigatório" })
    }
    if (typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha inválida" })
    }
    if (req.body.senha.length < 6) {
        erros.push({ texto: "A senha precisa ter pelo menos 6 digitos" })
    }
    if (!req.body.senha) {
        erros.push({ texto: "Senha obrigatória" })
    }
    if (userConfirm) {
        erros.push({ texto: "Email ja cadastrado, use outro!!" })
    }
    if (req.body.senha !== req.body.confirmSenha) {
        erros.push({ texto: "Senhas não conferem!!!" })
    }

    if (erros.length > 0) {
        res.status(500).send(erros)
    }

    else {
        try {
            const salt = await bcrypt.genSalt(12)
            const senhaHash = await bcrypt.hash(req.body.senha, salt)
            const novoUser = await User.create({
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha = senhaHash
            })
            res.status(201).json(novoUser)
            console.log('Usuário criado')

        } catch (err) {
            res.status(500).send(err.message)
        }
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json(users)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});

router.get('/users/:id', async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id, '-senha')
        return res.status(200).json(user)
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
        res.status(200).json({ msg: `Usuário: ${deleteUser.nome} foi de base.` })
        console.log('Usuário deletado')
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});

router.post('/user/login', async (req, res) => {
    // Validações
    if (!req.body.email) {
        return res.status(422).send({ texto: "Email obrigatório" })
    }
    if (!req.body.senha) {
        return res.status(422).send({ texto: "Senha obrigatória" })
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(422).send({ texto: "Usuário não encontrado" })
    }

    const checkSenha = await bcrypt.compare(req.body.senha, user.senha)
    if (!checkSenha) {
        return res.status(422).send({ texto: "Senha inválida" })
    }

    try {
        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: User._id,
            },
            secret
        )
        res.status(200).json({ texto: "Autenticação feita com sucesso", token })
    } catch (err) {
        res.status(500).send(err.message)
    }
})



module.exports = router