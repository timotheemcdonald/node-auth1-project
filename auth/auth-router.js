const router = require('express').Router()
const bcryptjs = require('bcryptjs')

const Users = require('../users/user-model.js')

router.post('/register', (req, res) => {
    const userInfo = req.body
    const isValid = validateUser(userInfo)

    if(isValid){
        const rounds = process.env.BCRYPT_ROUNDS || 4
        const hash = bcryptjs.hashSync(userInfo.password, rounds)
        userInfo.password = hash

        Users.add(userInfo)
        .then(inserted => {
            res.status(201).json({ data: inserted })
        })
        .catch(error => {
            res.status(500).json({ message: error.message})
        })
    } else {
        res.status(400).json({
            message: 'Invalid info try again'
        })
    }
})

router.post('/login', (req, res) => {
    const creds = req.body
    const isValid = validateCredentials(creds)

    if(isValid) {
        Users.findBy({username: creds.username})
        .then(([user]) => {
            if (user && bcryptjs.compareSync(creds.password, user.password)) {
                req.session.username = user.username;
                req.session.role = user.role;

                res.status(200).json({ message: `welcome ${creds.username}`,})
            } else {
                res.status(401).json({message: 'wrong credentials'})
            }
        })
        .catch(error => {
            res.status(500).json({message: error.message})
        })
    } else {
        res.status(400).json({ message: 'Invalid information'})
    }
})

router.get('/logout', (req, res) => {
    if (req.session){
        req.session.destroyer(err => {
            if (err){
                res.status(500).json({
                    message: 'logout error'
                })
            } else {
                res.status(204).end()
            }
        })
    } else {
        res.status(204).end()
    }
})

function validateUser(user){
    return user.username && user.password ? true : false;
}

function validateCredentials(creds){
    return creds.username && creds.password ? true : false;
}

module.exports = router;