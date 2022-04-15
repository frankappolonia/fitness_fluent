const express = require('express');
const router = express.Router();
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const userFuncs = require('../data')
const db = userFuncs.userFuncs

router.route('/')
    .get(async(request, response) =>{
        try {
            response.status(200).render('pages/login', {})
            
        } catch (e) {
            response.status(404).json('404: ' + e)
            
        }
    })
    .post(async(request, response)=>{
        //check if username and password are supplied in request body
        if(validations.checkRequestBody(request) === false){
            response.status(400).json('400: No username or password in the request body')
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