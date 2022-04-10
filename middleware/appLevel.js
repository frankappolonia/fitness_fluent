const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const static = express.static(__dirname + '/public');

function templateMiddleware(app){
    app.use('/public', static);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
    app.set('view engine', 'handlebars');

} 

function expressSessionMiddleware(app){
    app.use(
        session({
          name: 'AuthCookie',
          secret: "the most secret string ",
          resave: false,
          saveUninitialized: true,
          cookie: { maxAge: 60000 }
        })
      );

}

module.exports = {
    templateMiddleware,
    expressSessionMiddleware,
}