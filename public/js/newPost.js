
let postForm = $('#new-post-form')

//new post form validation
postForm.submit((event=>{
    let title = $('#title').val()
    let postBody = $('#postBody').val()
    try {
        newPostCheck(title, postBody)
        
    } catch (e) {
        event.preventDefault()
        $('#newPost-error').empty()
        $('#newPost-error').append(e)
        
    }

}))

function newPostCheck(title, body){
    if(arguments.length !== 2) throw "Invalid number of arguments"
    if(! title) throw "No title given!"
    if(! body) throw "No body given!"
    stringChecks([title, body])
    stringtrim(arguments)
    if (title.length < 6) throw "Title must be at least 6 characters!"
    if(body.length <25) throw "Post must be 25 characters minimum!"  
    return

}
function stringtrim(argsObj){
    /**Takes the arguments object of a function and trims all string types */
    for (arg in argsObj){
        if (typeof(argsObj[arg]) === 'string'){
            argsObj[arg] = argsObj[arg].trim()
        }
    } 
    return
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