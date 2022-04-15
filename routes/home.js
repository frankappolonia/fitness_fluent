const express = require('express');
const router = express.Router();

router.route('/')
    .get(async(request, response)=>{
        try {
            response.status(200).render('pages/home', {authenticated: request.session})
        } catch (e) {
            response.status(404).json("404: Page cannot be found")
        }
    });
module.exports = router;