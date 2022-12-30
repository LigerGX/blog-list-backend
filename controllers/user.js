const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (req, res, next) => {
  const body = req.body
  const hashedPassword = await bcrypt.hash(body.password, 10)

  try {
    const userList = await User.find({})

    let dupeUserCheck
    userList.forEach(user => {
      if (user.username === body.username) {
        dupeUserCheck = true
      }
    })

    if (dupeUserCheck || body.password.length < 3) {
      return res.status(400).json({ error: 'Invalid username or password' })
    }

    const user = new User({ ...body, password: hashedPassword })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch(exception) {
    next(exception)
  }
})

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs')
    res.json(users)
  } catch(exception) {
    next(exception)
  }
})

module.exports = userRouter