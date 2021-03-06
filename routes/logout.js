const express = require('express');
const session = require('express-session');
const router = express.Router();
const errorHandling = require('../helper')
const validations = errorHandling.userValidations


router.route('/')
    .get(async(request, response)=>{
        if(! request.session.user){
            response.status(400).render('partials/notLoggedIn', {})
            return
        }
        try {
            validations.checkId(request.session.user)
            //expire authcookie
            response.clearCookie('adminCookie')
            response.clearCookie('idCookie')
            response.clearCookie('authCookie')
            request.session.cookie.expires = 0

            response.status(200).render('pages/logout', {'script': "/public/js/filler.js",
            'script2':"/public/js/filler.js"})
        } catch (e) {
            response.status(404).render("error/404")
        }
    });
module.exports = router;