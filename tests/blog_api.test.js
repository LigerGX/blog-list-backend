const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blog_api_helper')

const api = supertest(app)

beforeAll(async () => {
  const user = helper.initialUsers[0]
  await api
    .post('/api/users')
    .send(user)

  const loginRes = await api
    .post('/api/login')
    .send({
      username: user.username,
      password: user.password
    })

  helper.authorization.token = loginRes.body.token
})

describe('Blog Router', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  describe('GET request tests', () => {
    test('get request returns all blog posts in JSON format', async () => {
      const blogs = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(blogs.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blog id is named id not _id', async () => {
      const blogs = await api.get('/api/blogs')

      expect(blogs.body[0].id).toBeDefined
    })

    describe('getting a specific blog', () => {
      test('returns blog in JSON format', async () => {
        const id = await helper.blogId

        await api
          .get(`/api/blogs/${id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
      })

      test('malformed id returns status 400', async () => {
        const id = undefined

        await api
          .get(`/api/blogs/${id}`)
          .expect(400)
      })
    })

    afterAll(async () => {
      await Blog.deleteMany({})
    })
  })

  describe('POST request tests', () => {
    test('can successfully create a new blog', async () => {
      const blog = {
        url: 'apitest.com',
        title: 'Testing the Blog Api',
        author: 'testman',
        likes: 42
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${helper.authorization.token}`)
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await api.get('/api/blogs')
      expect(blogs.body).toHaveLength(helper.initialBlogs.length + 1)

      const blogTitles = blogs.body.map(blog => blog.title)
      expect(blogTitles).toContain('Testing the Blog Api')
    })

    test('if likes property is missing form request, default likes value to 0', async () => {
      const blog = {
        url: 'apitest.com',
        title: 'Testing the Blog Api',
        author: 'testman',
      }

      const receivedBlog = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${helper.authorization.token}`)
        .send(blog)

      expect(receivedBlog.body.likes).toBeDefined()
      expect(receivedBlog.body.likes).toBe(0)
    })

    test('if title and/or url properties are missing return status code 400', async () => {
      const blog = {
        author: 'testman',
        likes: 42
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${helper.authorization.token}`)
        .send(blog)
        .expect(400)
    })
  })

  describe('DELETE request tests', () => {
    beforeEach(async () => {
      await Blog.deleteMany({})

      const blog = await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${helper.authorization.token}`)
        .send(helper.initialBlogs[0])

      helper.blogId = blog.body.id
    })

    test('can successfully delete a blog', async () => {
      const id = helper.blogId

      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `bearer ${helper.authorization.token}`)
        .expect(204)
    })
  })

  describe('UPDATE request tests', () => {
    test('can successfully update a blog', async () => {
      const id = helper.blogId

      const blog = await api.get(`/api/blogs/${id}`)
      console.log(blog.body)
      const update = {
        ...blog.body,
        title: 'This is an updated title!'
      }

      await api
        .put(`/api/blogs/${id}`)
        .send(update)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const updatedBlog = await api.get(`/api/blogs/${id}`)
      expect(updatedBlog.
        body.title).toBe('This is an updated title!')
    })
  })
})

describe('User Router', () => {
  beforeEach(async () =>  {
    await User.deleteMany({})
    const userObjects = helper.initialUsers.map(user => {
      return new User(user)
    })

    const promiseArray = userObjects.map(user => {
      return user.save()
    })

    await Promise.all(promiseArray)
  })

  describe('GET Requests', () => {
    test('can successfully see the details of all users', async () => {
      const users = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const usernameList = users.body.map(user => {
        return user.username
      })

      expect(usernameList).toContain('SphereHater')
      expect(usernameList).toHaveLength(helper.initialUsers.length)
    })

    test('password hash is not exposed', async () => {
      const users = await api.get('/api/users')
      const user = users.body[0]
      expect(user.password).toBeUndefined()
    })
  })

  describe('Post Requests', () => {
    test('can successfully create a new user', async () => {
      const user = {
        username: 'Tidus',
        name: 'Kaede Higuchi',
        password: 'finalfantasyx',
      }

      await api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const users = await api.get('/api/users')
      const usernameList = users.body.map(user => {
        return user.username
      })

      expect(usernameList).toContain('Tidus')
      expect(usernameList).toHaveLength(helper.initialUsers.length + 1)
    })

    test('must be a unique username', async () => {
      const user = {
        username: 'SphereLover',
        name: 'Kaede Higuchi',
        password: 'finalfantasyx',
      }

      const savedUser = await api
        .post('/api/users')
        .send(user)
        .expect(400)

      expect(savedUser.body.error).toBeDefined()
    })

    test('password must be at least 3 characters long', async () => {
      const user = {
        username: 'Tidus',
        name: 'Kaede Higuchi',
        password: '22',
      }

      const savedUser = await api
        .post('/api/users')
        .send(user)
        .expect(400)

      expect(savedUser.body.error).toBeDefined()

      const user2 = {
        username: 'Tidus',
        name: 'Kaede Higuchi',
        password: '333',
      }

      await api
        .post('/api/users')
        .send(user2)
        .expect(201)
    })

    test('invalid user is not added to database', async () => {
      const user = {
        username: 'SphereLover',
        name: 'Kaede Higuchi',
        password: '22',
      }

      await api
        .post('/api/users')
        .send(user)

      const userList = await api.get('/api/users')
      expect(userList.body).toHaveLength(helper.initialUsers.length)
    })
  })

  afterAll(async () => {
    await User.deleteMany({})
  })
})

afterAll(() => {
  mongoose.connection.close()
})