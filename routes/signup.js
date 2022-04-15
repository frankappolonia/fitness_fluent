const express = require('express');
const router = express.Router();
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const db = require('../data')
const userFuncs = db.userFuncs

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
        try {
            response.status(200).render('pages/signup', {script: "/public/js/signup.js"})
        } catch (e) {
            response.status(404).json('404: ' + e)
        }
    })
    .post(async(request, response)=>{
        const userData = request.body
        try{

        validations.signUpRouteValidation(userData)
        const {firstName, lastName, email, password, dob, height, weight, gender, activityLevel, goal} = userData
        await userFuncs.createUser(firstName, lastName, email, password, dob, height, weight, gender, activityLevel, goal)
        response.status(200).json('user created successfully')

        }catch(e){
            response.status(400).json('400: ' + e)
        }

    });

module.exports = router