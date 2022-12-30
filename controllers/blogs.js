const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.status(200).json(blogs)
})

router.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    response.status(200).json(blog)
  } catch(exception) {
    next(exception)
  }
})

router.post('/', async (request, response, next) => {
  const body = request.body

  try {
    if (!request.user.id) {
      return response.status(401).json({ error: 'missing or invalid token' })
    }

    const user = await User.findById(request.user.id)

    const newBlog = new Blog({
      ...body,
      user: user._id
    })

    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch(exception) {
    next(exception)
  }
})

router.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!request.token || request.user.id !== blog.user.toString()) {
      return response.status(401).json({ error: 'user is not authorized to perform this action' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

router.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, request.body, { returnDocument: 'after' })
    response.status(200).json(updatedBlog)
  } catch(exception) {
    next(exception)
  }
})

module.exports = router