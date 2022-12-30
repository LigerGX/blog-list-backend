const Blog = require('../models/blog')

const initialBlogs = [
  {
    url: 'testfu.com',
    title: 'Let\'s see what happens',
    author: 'NotMe',
    likes: 46,
  },
  {
    title: 'And We Are Doing This Again',
    author: 'IceBoy',
    url: 'endless.com',
    likes: 432,
  },
  {
    title: 'Letting it go',
    author: 'Nobe',
    url: 'test.com',
    likes: 4,
  },
  {
    title: 'BOAGGDS',
    author: 'Nobe',
    url: 'test.com',
    likes: 8,
  }
]

const initialUsers = [
  {
    username: 'SphereLover',
    name: 'Ben Franks',
    password: 'sufia348a',
  },
  {
    username: 'SphereHater',
    name: 'Frank Bens',
    password: 'a843aifus',
  },
  {
    username: 'GitGud',
    name: 'Auron',
    password: 'abcdefg123'
  }
]

const blogId = (async () => {
  const blog = await Blog.findOne({})
  return blog.id
})()

const authorization = {
  token: null
}

module.exports = {
  initialBlogs,
  blogId,
  initialUsers,
  authorization
}