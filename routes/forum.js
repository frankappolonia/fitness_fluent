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
const res = require('express/lib/response');

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
            //validations
            let id = validations.checkId(request.session.user)
            
            //stuff for daily goals widget
            authObj.authenticated = true        
            let cals = await userFuncs.getRemainingCalories(id)
            authObj['calories'] = cals
            //---------------------------------------

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
            //validations
            let id = validations.checkId(request.session.user)
           
            //stuff for daily goals widget
            authObj.authenticated = true        
            let cals = await userFuncs.getRemainingCalories(id)
            authObj['calories'] = cals
            //---------------------------------------

            authObj['script'] = "/public/js/newPost.js"

            response.status(200).render('pages/newPost', authObj)

        } catch (e) {
            response.status(404).render("errors/404")
        }
    }) 
    .post(async(request, response)=>{
        try {
            //validations
            let id = validations.checkId(request.session.user)
            forumValidations.newPostRouteCheck(request.body, id)
            let title = request.body.title.trim()
            let postBody = request.body.postBody.trim()

            let newPost = await postsFuncs.addPost(xss(title), xss(postBody), xss(id))

            response.status(200).redirect(`/forum/${newPost}`)

            
        } catch (e) {
            let error = {error: e}
            response.status(404).render("errors/400", e)
            
        }

    });

router.route('/:id')
    .get(async(request, response) =>{ //route for a particular post
        let authObj = {}

        try{
            let id = validations.checkId(request.session.user)
            let postId = validations.checkId(request.params.id)

            //stuff for daily goals widget
            authObj.authenticated = true        
            let cals = await userFuncs.getRemainingCalories(id)
            authObj['calories'] = cals
            //---------------------------------------
            
            authObj['script'] = "/public/js/existingPost.js"
            let post = await postsFuncs.getPostById(xss(postId))

            response.cookie("idCookie", JSON.stringify({userId: id, ogPoster: post.poster.id}))

            response.status(200).render("pages/forumPost", {...authObj, ...post})

        }catch(e){
            response.status(404).render("errors/404")
        }

    })
    .post(async(request, response)=>{ //route for posting a comment
        try {
            //validations
            let userId = validations.checkId(request.session.user)
            let postId = validations.checkId(request.params.id)
            forumValidations.newCommentRouteCheck(request.body, postId, userId)
            let commentBody = request.body.comment.trim()

            //db call
            let newComment = await postsFuncs.addComment(xss(postId), xss(userId), xss(commentBody))

            response.status(200).redirect(`/forum/${postId}`)

            
        } catch (e) {
            let error ={error: e}
            response.status(400).render("errors/400", error)
            
        }

    })
    .put(async(request, response)=>{
        try {
            //validations
            let userId = validations.checkId(request.session.user)
            let postId = validations.checkId(request.params.id)
            forumValidations.newPostRouteCheck(request.body, userId)
            
            //checks if the user owns the post
            let post = await postsFuncs.getPostById(xss(postId))
            if(userId !== post.poster.id){
                response.status(400).render("You are not authorized to edit this post!")
                return
            }

            let title = request.body.title.trim()
            let postBody = request.body.postBody.trim()

            let editPost = await postsFuncs.updatePost(xss(userId), xss(postId), xss(postBody), xss(title))
            response.status(200).json(editPost)
            
        } catch (e) {
            let error = {error: e} 
            response.status(400).render('errors/400', error )   
        }
    })
    .delete(async(request, response)=>{
        try {
            //validations
            let userId = validations.checkId(request.session.user)
            let postId = validations.checkId(request.params.id)

            //checks if user owns the post
            let post = await postsFuncs.getPostById(xss(postId))
            if(userId !== post.poster.id){
                response.status(400).render("You are not authorized to delete this post!")
                return
            }

            await postsFuncs.deletePost(xss(userId), xss(postId))
            response.status(200).json('post deleted')

        } catch (e) {
            let error = {error: e} 
            response.status(400).render('errors/400', error )
            
        }

    });

module.exports = router;