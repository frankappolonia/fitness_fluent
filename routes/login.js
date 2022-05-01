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
            authObj['script'] = "/public/js/login.js"
            authObj['css'] = "/public/css/signup.css"
            response.status(200).render('pages/login', authObj)
            
        } catch (e) {
            response.status(404).render('errors/404')
        }
    })
    .post(async(request, response)=>{
        //check if username and password are supplied in request body
        if(validations.checkRequestBody(request) === false){
            response.status(400).render('pages/login', )
            return
        }

        try {
            let username = validations.checkUsername(request.body.username)
            let password = validations.checkPassword(request.body.password)
            let validateUser = await db.checkUser(xss(username), xss(password))
            if (validateUser.authenticated === true){
                    request.session.name = 'AuthCookie'
                    request.session.user = validateUser.userId
                    request.session.admin = validateUser.admin
                    response.clearCookie('adminCookie')
                    response.cookie('adminCookie', request.session.admin)
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