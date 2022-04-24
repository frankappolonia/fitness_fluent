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
            console.log('test2')

            authObj['calories'] = cals
            console.log('test')
            response.status(200).render('pages/progress', authObj)

        } catch (e) {
            response.status(404).json("404: Progress page cannot be found")
        }
    });
module.exports = router;