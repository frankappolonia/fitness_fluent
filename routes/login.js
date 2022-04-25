const express = require('express');
const router = express.Router();
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const userFuncs = require('../data')
const db = userFuncs.userFuncs
const xss = require('xss')

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
        let authObj = {}
        try {
            if (request.session.user){
                authObj.authenticated = true
                let cals = await userFuncs.getRemainingCalories(request.session.user)
                authObj['calories'] = cals
            }
            authObj['script'] = "/public/js/login.js"

            response.status(200).render('pages/login', authObj)
            
        } catch (e) {
            response.status(404).render('pages/404')
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
            let validateUser = await db.checkUser(xss(username), xss(password))
            if (validateUser === 'user authenticated'){
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