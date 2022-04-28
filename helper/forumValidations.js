let userValidations = require('./userValidations')

function newPostCheck(title, body, id){
    if(arguments.length !== 3) throw "Invalid number of arguments"
    userValidations.stringChecks([title, body, id])
    userValidations.checkId(id)
    userValidations.stringtrim(arguments)
    if (title.length < 6) throw "Title must be at least 6 characters!"
    if(body.length <25) throw "Post must be 25 characters minimum!"  

}

function newPostRouteCheck(requestBody, id){
    if(! requestBody.title) throw "No title given!"
    if(! requestBody.postBody) throw "No post body given!"

    newPostCheck(requestBody.title, requestBody.postBody, id)

}

function newCommentCheck(postId, userId, commentBody){
    if(arguments.length !== 3) throw "Invalid number of arguments"
    userValidations.stringChecks([commentBody, postId, userId])
    userValidations.checkId(userId)
    userValidations.checkId(postId)
    userValidations.stringtrim(arguments)
    if(commentBody.length <7) throw "Comment must be 7 characters minimum!" 
}

function newCommentRouteCheck(requestBody, postId, userId){
    if(! requestBody.comment) throw "No comment entered!"
    newCommentCheck(postId, userId, requestBody.comment)

}

module.exports = {
    newPostCheck,
    newPostRouteCheck,
    newCommentCheck,
    newCommentRouteCheck
}