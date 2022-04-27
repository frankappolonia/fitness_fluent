
/**JS validations for new comments on existing posts, and updating or deleting exists posts */

//validation for new comment


let commentForm = $('#new-comment-form')

//new post form validation
commentForm.submit((event=>{
    let commentBody = $('#comment').val()
    try {
        newCommentCheck(commentBody)
        
    } catch (e) {
        event.preventDefault()
        $('#newComment-error').empty()
        $('#newComment-error').append(e)
        
    }

}))


//helper functions
function newCommentCheck(commentBody){
    if(arguments.length !== 1) throw "Invalid number of arguments"
    if(! commentBody) throw "No comment entered!"
    stringChecks([commentBody])
    stringtrim(arguments)
    if(commentBody.length <7) throw "Comment must be 7 characters minimum!" 
}

function stringtrim(argsObj){
    /**Takes the arguments object of a function and trims all string types */
    for (arg in argsObj){
        if (typeof(argsObj[arg]) === 'string'){
            argsObj[arg] = argsObj[arg].trim()
        }
    } 
}

function stringChecks(strings){
    /**Takes an array as an argument, where the array contains the data you want to validate */
    strings.forEach(e => {
        if(typeof(e)!== 'string') throw "An argument is not a string!"
        e = e.trim()
        if(e.length < 1) throw "All strings must be at least 1 character!"
        
    });
    return
}