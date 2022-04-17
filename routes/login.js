const express = require('express');
const router = express.Router();
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const userFuncs = require('../data')
const db = userFuncs.userFuncs

//if the user is authenticated, redirect to home
router.get('/', (request, response, next)=>{
    if (request.session.user) {
      return response.redirect('/');
    } else {
      next()
    }
})

//otherwise, do login route as normal
router.route('/')
    .get(async(request, response) =>{
        try {
            response.status(200).render('pages/login', {script: "/public/js/login.js", authenticated: request.session})
            
        } catch (e) {
            response.status(404).json('404: ' + e)
            
        }
    })
    .post(async(request, response)=>{
        //check if username and password are supplied in request body
        if(validations.checkRequestBody(request) === false){
            let error = 'Error: Username or password left blank'
            response.status(400).render('pages/login', {error})
            return
        }

        try {
            let username = validations.checkUsername(request.body.username)
            let password = validations.checkPassword(request.body.password)
            let validateUser = await db.checkUser(username, password)
            if (typeof(validateUser) === 'object'){
                if('authenticated' in validateUser && validateUser['authenticated'] === true)
                    request.session.name = 'AuthCookie'
                    request.session.user = username
                    response.status(200).redirect('/')
                    return
            }

            
        } catch (e) {
            let error = "Login failed! Reason: " + e
            response.status(400).render('pages/login', {error})
            return
            
        }

});

module.exports = router