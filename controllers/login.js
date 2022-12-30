const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (req, res, next) => {
  const body = req.body
  try {
    const user = await User.findOne({ username: body.username })
    const requestValidity = async () => {
      if (user === null) {
        return false
      }

      return await bcrypt.compare(body.password, user.password)
    }

    if (await requestValidity() === false) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }
    const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)

    res.status(200).send({ token, username: user.username, name: user.name })
  } catch(exception) {
    next(exception)
  }

})

module.exports = loginRouter