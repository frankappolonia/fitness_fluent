const appMiddleware = require('./appLevel')

const constructorMethod = (app) => {
    appMiddleware.templateMiddleware(app)
    appMiddleware.expressSessionMiddleware(app)
}

module.exports = constructorMethod