const express = require('express');
const router = express.Router();
const errorHandling = require('../helper')
const validations = errorHandling.userValidations

router.route('/')
    .get(async(request, response) =>{
        try {
            response.status(200).render('pages/signup', {})
        } catch (e) {
            response.status(404).json('404: ' + e)
        }
    })
    .post(async(request, response)=>{

        try{
        console.log(request.body.dob)

        validations.signUpRouteValidation(request.body)

        }catch(e){
            response.status(400).json('400: ' + e)
        }

    });

module.exports = router