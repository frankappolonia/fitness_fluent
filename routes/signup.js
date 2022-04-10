const express = require('express');
const router = express.Router();

router.route('/')
    .get(async(request, response) =>{
        try {
            response.status(200).render('pages/signup', {})
            
        } catch (e) {
            response.status(404).json('404: ' + e)
            
        }
    });

module.exports = router