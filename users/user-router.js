const router = require('express').Router()

const Users = require('./user-model.js')

router.get('/', (req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({ message: err.message})
    })
})

module.exports = router;