const home = require('./home')
const login = require('./login')
const logout = require('./logout')
const signup = require('./signup')
const progress = require('./progress')
const exercises = require('./exercises')

const constructorMethod = (app) => {
  //middleware function
    app.use('/', home);
    app.use('/login', login);
    app.use('/logout', logout);
    app.use('/signup', signup)
    app.use('/progress', progress)
    app.use('/exercises', exercises)
    app.use('*', (req, res) => {
      res.status(404).json({ error: 'PAGE NOT FOUND!' });
    });
  };
  
  module.exports = constructorMethod;