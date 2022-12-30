const dummy = (blogs) => {
  return 1 | blogs
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, current) => {
    return prev + current.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  const sortedBlogs = blogs.sort((a, b) => {
    return b.likes - a.likes
  })

  return {
    title: sortedBlogs[0].title,
    author: sortedBlogs[0].author,
    likes: sortedBlogs[0].likes
  }
}

const mostBlogs = (blogs) => {
  const blogTotals = {}

  blogs.forEach(blog => {
    blogTotals[blog.author]
      ? blogTotals[blog.author]++
      : blogTotals[blog.author] = 1
  })

  const sortedBlogTotals = Object.entries(blogTotals).sort((a, b) => {
    return b[1] - a[1]
  })

  return {
    author: sortedBlogTotals[0][0],
    blogs: sortedBlogTotals[0][1],
  }
}

const mostLikes = (blogs) => {
  const likeTotals = {}

  blogs.forEach(blog => {
    likeTotals[blog.author]
      ? likeTotals[blog.author] += blog.likes
      : likeTotals[blog.author] = blog.likes
  })

  const sortedBlogTotals = Object.entries(likeTotals).sort((a, b) => {
    return b[1] - a[1]
  })

  return {
    author: sortedBlogTotals[0][0],
    likes: sortedBlogTotals[0][1],
  }
}

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  blogs,
  mostBlogs,
  mostLikes,
}