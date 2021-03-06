const express = require('express');
const router = express.Router();
const db = require('../data')
const postsFuncs = db.postFuncs
const userFuncs = db.userFuncs
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const forumValidations = errorHandling.forumValidations
const xss = require('xss');


//if the user is NOT authenticated, redirect to home
router.get('/', (request, response, next)=>{
    if (! request.session.user) {
      return response.redirect('/');
    } else {
      next()
    }
})
router.get('/new', (request, response, next)=>{
    if (! request.session.user) {
      return response.redirect('/');
    } else {
      next()
    }
})

router.get('/:id', (request, response, next)=>{
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
            let nutrients = await userFuncs.getRemainingCalories(xss(id))
            authObj = {...authObj, ...nutrients}
            authObj['css'] = "/public/css/forum_styles.css"
            //---------------------------------------

            let allPosts = await postsFuncs.getAllPosts()
            authObj['posts'] = allPosts
            authObj['script'] = "/public/js/filler.js"
            authObj['script2'] = "/public/js/filler.js"
            response.status(200).render('pages/forum', authObj)

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
            let nutrients = await userFuncs.getRemainingCalories(xss(id))
            authObj = {...authObj, ...nutrients}
            // authObj['name'] = nutrients.name

            //---------------------------------------

            authObj['script'] = "/public/js/newPost.js"
            authObj['script2'] = "/public/js/filler.js"
            authObj['css'] = "/public/css/forum_styles.css"

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
            response.status(400).render("errors/400", {error: e})
            
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
            let nutrients = await userFuncs.getRemainingCalories(xss(id))
            authObj = {...authObj, ...nutrients}
            //---------------------------------------
            
            authObj['script'] = "/public/js/existingPost.js"
            authObj['script2'] = "/public/js/filler.js"
            authObj['css'] = "/public/css/forumComments.css"

            let post = await postsFuncs.getPostById(xss(postId))

            response.cookie("idCookie", JSON.stringify({userId: id, ogPoster: post.poster.id}))
            response.cookie('adminCookie', JSON.stringify(request.session.admin))

            response.status(200).render("pages/comments", {...authObj, ...post})

        }catch(e){
            response.status(400).render("errors/400", {error: e})
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
            
             //checks if user owns the post or is an admin
             let post = await postsFuncs.getPostById(xss(postId))
             let admin = request.session.admin
             if(admin === false){
                 if(userId !== post.poster.id){
                     response.status(400).send("You are not authorized to edit this post!")
                     return
                 }
             }  

            let title = request.body.title.trim()
            let postBody = request.body.postBody.trim()

            let editPost = await postsFuncs.updatePost(xss(userId), xss(postId), xss(postBody), xss(title))
            response.status(200).json(editPost)
            
        } catch (e) {
            let error = e
            response.status(400).send('Error: ' + error )   
        }
    })
    .delete(async(request, response)=>{
        try {
            //validations
            let userId = validations.checkId(request.session.user)
            let postId = validations.checkId(request.params.id)

            //checks if user owns the post or is an admin
            let post = await postsFuncs.getPostById(xss(postId))
            let admin = request.session.admin
            if(admin === false){
                if(userId !== post.poster.id){
                    response.status(400).send("You are not authorized to delete this post!")
                    return
                }
            }

            await postsFuncs.deletePost(xss(userId), xss(postId))
            response.status(200).json('post deleted')

        } catch (e) {
            let error = e
            response.status(400).send('Error: ' + error ) 
            
        }

    });

module.exports = router;