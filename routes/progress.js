const express = require('express');
const router = express.Router();
const db = require('../data')
const userFuncs = db.userFuncs

//if the user is NOT authenticated, redirect to home
router.get('/', (request, response, next)=>{
    if (! request.session.user) {
      return response.redirect('/');
    } else {
      next()
    }
})

router.route('/')
    .get(async(request, response)=>{
        let authObj = {}
        try {
            authObj.authenticated = true
            let cals = await userFuncs.getRemainingCalories(request.session.user)
            authObj['calories'] = cals
            authObj['script2'] = '/public/js/progress.js'
            authObj['script'] = "https://cdn.jsdelivr.net/npm/chart.js"
           
            response.status(200).render('pages/progress', authObj)

        } catch (e) {
            response.status(404).json("404: Progress page cannot be found")
        }
    });
module.exports = router;