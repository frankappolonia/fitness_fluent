const express = require('express');
const router = express.Router();
const db = require('../data')
const postsFuncs = db.postFuncs
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
            authObj.authenticated = true
            let id = validations.checkId(request.session.user)
            
            let cals = await userFuncs.getRemainingCalories(id)
            authObj['calories'] = cals

            let allPosts = await postsFuncs.getAllPosts()
            authObj['posts'] = allPosts
            //response.status(200).json(posts)
            response.status(200).render('pages/forumHome', authObj)

        } catch (e) {
            response.status(404).render("errors/404")
        }
    });

router.route('/:id')
    .get(async(request, response) =>{
        let authObj = {}

        try{
            authObj.authenticated = true
            let id = validations.checkId(request.session.user)
            
            let cals = await userFuncs.getRemainingCalories(id)
            authObj['calories'] = cals

            let postId = validations.checkId(request.params.id)
            let post = await postsFuncs.getPostById(postId)

            response.status(200).render("pages/forumPost", post)

        }catch(e){
            response.status(404).render("errors/404")
        }

    });

module.exports = router;