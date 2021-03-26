const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')

const User = require('./models').User
const Topic = require('./models').Topic
const Question = require('./models').Question
const Answer = require('./models').Answer
const { Sequelize } = require('sequelize')

const app = express()

const corsOptions = {
  origin: '*'
}

app.use(cors())
app.options('*', cors()) // include before other routes
app.use(bodyParser.json())

const jwtOptions = {
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret'
}
const strategy = new passportJWT.Strategy(jwtOptions, async (payload, next) => {
  const user = await User.findOne({ where: { id: payload.id } })
  if (user) {
    next(null, user)
  } else {
    next(null, false)
  }
})
passport.use(strategy)
app.use(passport.initialize())

app.get('/questions', async (req, res) => {
  const query = {
    attributes: {
      include: [[Sequelize.fn('COUNT', Sequelize.col('answers.id')), 'answerCount']]
    },
    include: [
      {
        model: Topic,
        attributes: ['title']
      },
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Answer,
        attributes: []
      }
    ],
    group: ['question.id']
  }
  const topic = req.query.topic
  if (topic) {
    query.where = { '$topic.title$': topic }
  }
  const questions = await Question.findAll(query)
  res.json({ questions })
})

app.get('/questions/:questionId', async (req, res) => {
  const { questionId } = req.params
  const query = {
    where: { id: questionId },
    include: [
      {
        model: Answer,
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Topic,
        attributes: ['title']
      }
    ]
  }
  const answer = await Question.findOne(query)
  res.json(answer)
})

app.post('/questions/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const question = req.body
  const topic = await Topic.findOne({ where: { title: question.topicTitle } })
  const result = await Question.create({ userId: question.userId, topicId: topic.id, title: question.title })
  res.status(201).json(result)
})

app.post('/answers/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const answer = req.body
  const result = await Answer.create({ userId: answer.userId, questionId: answer.questionId, text: answer.text })
  res.status(201).json(result)
})

app.get('/topics', async (req, res) => {
  const topics = await Topic.findAll()
  res.json({ topics })
})

app.post('/register', async (req, res, next) => {
  const { username, password } = req.body
  if (username && password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!password.match(regex)) {
      res.status(400).json({
        errors: { password: 'Password should contain at least 8 characters and 1 number' }
      })
    }
    const hash = bcrypt.hashSync('testtest1', 10)
    try {
      const user = await User.create({ username, password: hash })
      res.status(201).json({ user: { username: user.username } })
    } catch (error) {
      const errors = {}
      const msg = error.errors[0].message
      if (msg.includes('username')) {
        errors.username = msg
      } else {
        errors.msg = msg
      }
      res.status(400).json({ errors })
    }
  } else {
    const errors = {}
    if (!username) {
      errors.username = 'Username is required'
    }
    if (!password) {
      errors.password = 'Password is required'
    }
    res.status(400).json({ errors })
  }
})

app.post('/login', async function (req, res, next) {
  const { username, password } = req.body
  if (username && password) {
    const user = await User.findOne({ where: { username } })
    if (!user) {
      res.status(401).json({ errors: { username: 'No such user found' } })
    }
    const isValidPassword = bcrypt.compareSync(password, user.password)
    if (isValidPassword) {
      const payload = { id: user.id }
      const token = jwt.sign(payload, jwtOptions.secretOrKey)
      res.json({ token: token })
    } else {
      res.status(401).json({ errors: { password: 'Password is incorrect' } })
    }
  }
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () =>
  console.log(`Express server started on port ${PORT}`)
)
