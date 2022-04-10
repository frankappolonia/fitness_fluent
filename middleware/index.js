const appMiddleware = require('./appLevel')

const constructorMethod = (app) => {
    appMiddleware.expressSessionMiddleware(app)
    appMiddleware.templateMiddleware(app)
}

module.exports = constructorMethod