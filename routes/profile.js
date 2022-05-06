const express = require("express");
const router = express.Router();
const db = require("../data");
const userFuncs = db.userFuncs;
const errorHandling = require('../helper');
const validations = errorHandling.userValidations;
const xss = require('xss');

//if the user is NOT authenticated, redirect to home
router.get('/', (request, response, next)=>{
    if (! request.session.user) {
        return response.redirect('/');
    } else {
        next()
    }
});

router.route("/")
    .get(async (request, response) => {
        try {
            let authObj = {};
            //validations
            let id = validations.checkId(request.session.user);

            //stuff for daily goals widget
            authObj.authenticated = true        
            let nutrients = await userFuncs.getRemainingCalories(id)
            authObj = {...authObj, ...nutrients}
            //---------------------------------------

            let user = await userFuncs.getUserById(xss(id));

            response.status(200).render("pages/profile", authObj)
        } catch (e) {
            response.status(400).render("errors/400", {error: e});
        }
    })