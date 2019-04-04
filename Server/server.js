require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')

const auth = require('./middleware/authMiddleware')
const treasureCtrl = require('./Controller/treasureContorller')
const authCtrl = require('./Controller/authController')
const app = express()

const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env

massive(CONNECTION_STRING) 
  .then(db => {
    app.set('db', db)
    console.log('db is connected')
  })
  

app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365
  }
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', treasureCtrl.getUserTreasure)

app.listen(SERVER_PORT, () => console.log(`Server listening on ${SERVER_PORT}`))
