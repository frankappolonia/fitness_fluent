const express = require('express');
const router = express.Router();
const db = require('../data')
const userFuncs = db.userFuncs
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
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
            //validations
            let id = validations.checkId(request.session.user)

            //stuff for daily goals widget
            authObj.authenticated = true        
            let nutrients = await userFuncs.getRemainingCalories(id)
            authObj = {...authObj, ...nutrients}
            //---------------------------------------

            //scripts
            authObj['script2'] = '/public/js/progress.js'
            authObj['script'] = "https://cdn.jsdelivr.net/npm/chart.js"
            authObj['css'] = "/public/css/progress.css"
            
            //this gets their overall weight progress when the page is initially loaded
            let weightProgress = await userFuncs.getOverallWeightProgress(id)
            authObj['lostOrGain'] = weightProgress.weightChange
            authObj['weight'] = weightProgress.weight
            
            response.status(200).render('pages/progress', authObj)

        } catch (e) {
            response.status(404).render("errors/404")
        }
    })
    .post(async(request, response)=>{
        let data = request.body

        try {
            //validations
            let id = validations.checkId(request.session.user)
            validations.progressRouteValidation(data)
            let graphData = await userFuncs.getWeights(xss(id), xss(data.start).trim(), xss(data.end).trim())
            response.json(graphData)

        } catch (e) {
            response.status(404).json(e)
        }

    });

router.route('/initial_data')
    .post(async(request, response)=>{
        try {
            //validations
            let id = validations.checkId(request.session.user)
            let graphData = await userFuncs.getAllWeights(xss(id))
            response.json(graphData)

        } catch (e) {
            response.status(404).json(e)
        }

});
module.exports = router;