const express = require('express');
const router = express.Router();


router.route('/')
    .get(async(request, response)=>{
        if(! request.session.user){
            response.status(400).render('partials/notLoggedIn', {})
            return
        }
        try {
            //expire authcookie
            request.session.cookie.expires = 0
            response.status(200).render('pages/logout', {})
        } catch (e) {
            response.status(404).json("404: Page cannot be found")
        }
    });
module.exports = router;