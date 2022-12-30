const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]

    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(listHelper.blogs)).toBe(36)
  })

  describe('favorite blog', () => {
    test('will return the blog with the most likes', () => {
      expect(listHelper.favoriteBlog(listHelper.blogs)).toEqual({
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      })
    })

    test('will return the author with the most blogs', () => {
      expect(listHelper.mostBlogs(listHelper.blogs)).toEqual({
        author: 'Robert C. Martin',
        blogs: 3
      })
    })

    test('will return the author with the most total likes', () => {
      expect(listHelper.mostLikes(listHelper.blogs)).toEqual({
        author: 'Edsger W. Dijkstra',
        likes: 17
      })
    })
  })
})