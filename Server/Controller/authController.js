const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    const {username, password, isAdmin} = req.body
    const db = req.app.get('db')
    let response = await db.get_user(username)
    let user = response[0]
    if(user){
      return res.status(409).send('username taken')
    }
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const result = await db.register_user(isAdmin, username, hash)
    const existingUser = result[0]
    req.session.user = existingUser
    res.send(req.session.user)
  },

  login: async (req, res) => {
    const { username, password } = req.body
    const foundUser = await req.app.get('db').get_user([username])
    let user = foundUser[0]
    if(!user){
      return res.status(401)
      .send('User not found. Please register as a new user before logging in')
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash)
    if(!isAuthenticated){
      res.status(403).send('Incorrect password')
    }
    req.session.user = user
    res.status(200).send(req.session.user)
    
  },

  logout: async (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
  }
}