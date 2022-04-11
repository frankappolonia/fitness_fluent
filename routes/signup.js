const express = require('express');
const router = express.Router();
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const db = require('../data')
const userFuncs = db.userFuncs

router.route('/')
    .get(async(request, response) =>{
        try {
            response.status(200).render('pages/signup', {})
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