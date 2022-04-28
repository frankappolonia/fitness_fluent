const express = require('express');
const router = express.Router();
const db = require('../data')
const postsFuncs = db.postFuncs
const userFuncs = db.userFuncs
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const forumValidations = errorHandling.forumValidations
const xss = require('xss');
const { response } = require('express');

//if the user is NOT authenticated, redirect to home
router.get('/', (request, response, next)=>{
    if (! request.session.user) {
      return response.redirect('/');
    } else {
      next()
    }
})

router.route('/') //route for all posts/forum home
    .get(async(request, response)=>{
        let authObj = {}
        try {
            authObj.authenticated = true
            let id = validations.checkId(request.session.user)
            
            let cals = await userFuncs.getRemainingCalories(id)
            authObj['calories'] = cals

            let allPosts = await postsFuncs.getAllPosts()
            authObj['posts'] = allPosts
            response.status(200).render('pages/forumHome', authObj)

        } catch (e) {
            response.status(404).render("errors/404")
        }
    });

router.route('/new') //route for a new post
    .get(async(request, response)=>{
        let authObj = {}
        try {
            authObj.authenticated = true
            let id = validations.checkId(request.session.user)
            
            let cals = await userFuncs.getRemainingCalories(id)
            authObj['calories'] = cals

            authObj['script'] = "/public/js/newPost.js"

            response.status(200).render('pages/newPost', authObj)

        } catch (e) {
            response.status(404).render("errors/404")
        }
    }) 
    .post(async(request, response)=>{
        try {
            let id = validations.checkId(request.session.user)
            forumValidations.newPostRouteCheck(request.body, id)
            let title = request.body.title.trim()
            let postBody = request.body.postBody.trim()

            let newPost = await postsFuncs.addPost(xss(title), xss(postBody), xss(id))

            response.status(200).redirect(`/forum/${newPost}`)

            
        } catch (e) {
            response.status(404).render("errors/400", {error: e})
            
        }

    });

router.route('/:id')
    .get(async(request, response) =>{ //route for a particular post
        let authObj = {}

        try{
            validations.checkId(request.params.id)
            authObj.authenticated = true
            let id = validations.checkId(request.session.user)
            
            let cals = await userFuncs.getRemainingCalories(id)
            authObj['calories'] = cals
            
            authObj['script'] = "/public/js/existingPost.js"
            let postId = validations.checkId(request.params.id)
            let post = await postsFuncs.getPostById(postId)

            response.status(200).render("pages/forumPost", {...authObj, ...post})

        }catch(e){
            response.status(404).render("errors/404")
        }

    })
    .post(async(request, response)=>{ //route for posting a comment
        try {
            let userId = validations.checkId(request.session.user)
            let postId = validations.checkId(request.params.id)

            forumValidations.newCommentRouteCheck(request.body, postId, userId)
            let commentBody = request.body.comment.trim()

            let newComment = await postsFuncs.addComment(xss(postId), xss(userId), commentBody)

            response.status(200).redirect(`/forum/${postId}`)

            
        } catch (e) {
            response.status(404).render("errors/400", {error: e})
            
        }

    });

module.exports = router;