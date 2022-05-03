const express = require('express');
const router = express.Router();
const db = require('../data')
const userFuncs = db.userFuncs
const errorHandling = require('../helper')
const validations = errorHandling.userValidations

router.route('/')
    .get(async(request, response)=>{
        let authObj = {}
        try {
            if (request.session.user){
                let id = validations.checkId(request.session.user)
                //stuff for daily goals widget
                authObj.authenticated = true        
                let cals = await userFuncs.getRemainingCalories(id)
                authObj['calories'] = cals
                //---------------------------------------"
                }
            authObj['css'] = "/public/css/main_styles.css"
            authObj['script'] = "/public/js/filler.js"
            authObj['script2'] = "/public/js/filler.js"
            
            console.log(request.session)
            response.status(200).render('pages/homepage', authObj)
        } catch (e) {
            response.status(404).render('errors/404')
        }
    });
module.exports = router;