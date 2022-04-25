const express = require('express');
const router = express.Router();
const db = require('../data')
const userFuncs = db.userFuncs

router.route('/')
    .get(async(request, response)=>{
        let authObj = {}
        try {
            if (request.session.user){
                authObj.authenticated = true
                let cals = await userFuncs.getRemainingCalories(request.session.user)
                authObj['calories'] = cals
            }

            response.status(200).render('pages/home', authObj)
        } catch (e) {
            response.status(404).render('pages/404')
        }
    });
module.exports = router;