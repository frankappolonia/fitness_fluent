const { request } = require('express')
let userValidations = require('./userValidations')

function newPostCheck(title, body, id){
    if(arguments.length !== 3) throw "Invalid number of arguments"
    userValidations.stringChecks([title, body, id])
    id = userValidations.checkId(id)
    userValidations.stringtrim(arguments)
    if (title.length < 6) throw "Title must be at least 6 characters!"
    if(body.length <25) throw "Post must be 25 characters minimum!"  

}

function newPostRouteCheck(requestBody, id){
    if(! requestBody.title) throw "No title given!"
    if(! requestBody.postBody) throw "No post body given!"

    newPostCheck(requestBody.title, requestBody.postBody, id)

}

module.exports = {
    newPostCheck,
    newPostRouteCheck
}