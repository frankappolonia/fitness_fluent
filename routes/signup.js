const express = require('express');
const router = express.Router();
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const db = require('../data')
const userFuncs = db.userFuncs
const xss = require('xss')

//if the user is authenticated, redirect to home
router.get('/', (request, response, next)=>{
    if (request.session.user) {
      return response.redirect('/');
    } else {
      next()
    }
})

//Otherwise, run signup route as usual
router.route('/')
    .get(async(request, response) =>{
        let authObj = {}
        try {
           
            authObj.authenticated = true
            authObj['script'] = "/public/js/signup.js"
            
            response.status(200).render('pages/signup', authObj)
        } catch (e) {
            response.status(404).render('pages/404')
        }
    })
    .post(async(request, response)=>{
        const userData = request.body
        try{

        validations.signUpRouteValidation(userData)

        const {firstName, lastName, email, password, dob, height, weight, gender, activityLevel, goal} = userData
        await userFuncs.createUser(xss(firstName), xss(lastName), xss(email), xss(password), xss(dob), xss(height), 
                                    xss(weight), xss(gender), xss(activityLevel), xss(goal))
        response.status(200).render('partials/successfulSignup')

        }catch(e){
            response.status(400).render('pages/signup', {script: "/public/js/signup.js", error: "Error: "+ e})
        }

    });

module.exports = router