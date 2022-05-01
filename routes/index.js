const home = require('./home')
const login = require('./login')
const logout = require('./logout')
const signup = require('./signup')
const foodLog = require('./foodLog')
const progress = require('./progress')
const exercises = require('./exercises')
const forum = require('./forum')

const constructorMethod = (app) => {
  //middleware function
    app.use('/', home);
    app.use('/login', login);
    app.use('/logout', logout);
    app.use('/signup', signup)
    app.use('/food-log', foodLog)
    app.use('/progress', progress);
    app.use('/exercises', exercises);
    app.use('/forum', forum);
    app.use('*', (req, res) => {
      res.status(404).render('errors/404');
    });
  };
  
  module.exports = constructorMethod;