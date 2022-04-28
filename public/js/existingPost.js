
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

}));


/**Function for deleting a post */
let url = window.location.href
let postId = url.substring(url.lastIndexOf('/')+1) //https://stackoverflow.com/questions/3730359/get-id-from-url-with-jquery

let userId = $('#userIdEmbed').text()
let posterId = $('#ogPosterIdEmbed').text()

//1. first, when the page loads, we will show a delete post button if the user on the page is the owner of the post
if (posterId === userId){
    let deleteButton = $('<button type="submit" id="delete-post-btn" class="btn btn-danger">Delete post</button>')
    bindEventsToTodoItem(deleteButton)
    $('#main-post').append(deleteButton)

}

//store in session storage

function bindEventsToTodoItem(btn) {
    btn.on('click', function (event) {
      //1. prevent default
      event.preventDefault()
      $.ajax({
        method: "DELETE",
        url: `/forum/${postId}`,
        success: (response)=>{
            console.log(response)
            $('#post-thread').empty()
            $('#comment-form-container').empty()
            $('#post-thread').append('<p>Post deleted successfully</p>')
        },
        error: (response)=>{
         console.log('unsuccsessful deletion')
         $('#main-post-error').empty()
          $('#main-post-error').append("Could not delete post")

            }
        })
    })
}


        





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