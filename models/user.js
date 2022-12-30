const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
  },
  name: String,
  password: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', { transform: (doc, ret) => {
  const id = ret._id
  delete ret._id
  delete ret.__v
  delete ret.password
  return { ...ret, id: id }
} })

const User = mongoose.model('User', userSchema)

module.exports = User