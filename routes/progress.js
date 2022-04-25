const express = require('express');
const router = express.Router();
const db = require('../data')
const userFuncs = db.userFuncs
const xss = require('xss')

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
    })
    .post(async(request, response)=>{
        try {
            //do error checking
            let data = request.body
            let graphData = await userFuncs.getWeights(request.session.user, xss(data.start), xss(data.end))
            response.json(graphData)

        } catch (e) {
            response.status(404).json(e)
        }

    });

module.exports = router;