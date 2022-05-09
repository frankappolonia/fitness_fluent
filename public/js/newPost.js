
let postForm = $('#new-post-form')

//new post form validation
postForm.submit((event=>{
    /**Simple callback function that is used to validate the new post form submit, and, if
     * there is erronous input, prevent the default action
     */
    let title = $('#title').val()
    let postBody = $('#postBody').val()
    try {
        newPostCheck(title, postBody)
        
    } catch (e) {
        event.preventDefault()
        $('#new-post-error').empty()
        $('#new-post-error').append(e)
        
    }

}))

function checkHtmlTags(str) { //https://www.tutorialspoint.com/how-to-remove-html-tags-from-a-string-in-javascript
    
    str.forEach(s =>{
        if(s.match( /(<([^>]+)>)/ig)){
            throw "Cannot input html tags!"
        }
    })
  }

/**Validation functions for above */
function newPostCheck(title, body){
    if(arguments.length !== 2) throw "Invalid number of arguments"
    if(! title) throw "No title given!"
    if(! body) throw "No body given!"
    stringChecks([title, body])
    checkHtmlTags([title, body])
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
}

function stringChecks(strings){
    /**Takes an array as an argument, where the array contains the data you want to validate */
    strings.forEach(e => {
        if(!(isNaN(e))) throw "Title and body must be strings!"
        e = e.trim()
        if(e.length < 1) throw "All strings must be at least 1 character!"
        
    });
    return
}