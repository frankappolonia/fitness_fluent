//Express and express session
const express = require('express');
const app = express();

//Routing and html templating
const configRoutes = require('./routes');

const middleware = require('./middleware')
const appMiddleware = middleware.appMiddleware

//Templating middleware wrapper function
appMiddleware.templateMiddleware(app)

//Express session middleware wrapper function
appMiddleware.expressSessionMiddleware(app)

//Routing middleware wrapper function
configRoutes(app);

//Server start
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});