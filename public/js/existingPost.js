
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


let url = window.location.href
let postId = url.substring(url.lastIndexOf('/')+1) //https://stackoverflow.com/questions/3730359/get-id-from-url-with-jquery

let cookie = (decodeURIComponent(document.cookie))

let userId = cookie.slice(20,44)
let posterId = cookie.slice(58,cookie.length-2)

let deleteButton = $('<button type="submit" id="delete-post-btn" class="btn btn-danger">Delete post</button>')
let editButton = $('<button type="submit" id="edit-post-btn" class="btn btn-warning">Edit post</button>')

editButtonClick(editButton)
deletePostEvent(deleteButton)

//1. first, when the page loads, we will show a delete/edit post button if the user on the page is the owner of the post
if (posterId === userId){
    $('#main-post').append(editButton)
    $('#main-post').append(deleteButton)

}

function editButtonClick(btn){
    /**This function handles the click event for when a user clicks edit post. What happens is
     * that the original post content is emptied, and a form is created to update the post.
     * The form is by default populated with the posts current content, so you can "edit" the post
     */
    btn.on('click', function (event) {
        event.preventDefault()
        let ogPostBody = $('#post-body').text()
        let ogPostTitle = $('#post-title').text()

        let editHtml = $(
            '<form method="post" id="edit-post-form">'+
                '<div id=editPostDiv class="form-group">' +
                '<label for="title">Enter post title</label>' +
                `<input type="text" value="${ogPostTitle}" class="form-control" id="title" name="title" >`+
                '<label for="postBody">Post</label>'+
                `<input type="text" value="${ogPostBody}" class="form-control" id="postBody" name="postBody">`+
            '</div>'+
            '</form>')
        
        $('#main-post').empty()
        $('#main-post').append(editHtml)
        let submitEdit = $('<button type="submit" class="btn btn-warning">Submit Edit</button>')
        editPost(submitEdit)
        $('#editPostDiv').append(submitEdit)
    })
}

function editPost(btn) {
    /**This function handles the click event of the edit post form thats created above.
     * It sends an ajax request to the server to update the post in the db. Upon successful PUT,
     * it creates new html content with the updated post, removes the edit post form,
     *  and appends the updated post to the <section> html
     */
    btn.on('click', function (event) {
      //1. prevent default
      event.preventDefault()
      let title = $('#title').val()
      let body = $('#postBody').val()
      try{
        newPostCheck(title, body)
        $.ajax({
            method: "PUT",
            url: `/forum/${postId}`,
            contentType: 'application/json',
            data: JSON.stringify({
            title: title,
            postBody: body
            }),
            success: (response)=>{
                let editedPostHtml = $(
                `<h2 id="post-title">${response.title}</h2>`+
                `<h3>Author: ${response.poster.name}</h3>`+
                `<p id="post-body">${response.body}</p>`+
                `<div id="main-post-error"></div>`)

                $('#main-post-error').empty()
                $('#main-post').empty()
                $('#main-post').append(editedPostHtml)

                let deleteButton2 = $('<button type="submit" id="delete-post-btn" class="btn btn-danger">Delete post</button>')
                let editButton2 = $('<button type="submit" id="edit-post-btn" class="btn btn-warning">Edit post</button>')

                editButtonClick(editButton2)
                deletePostEvent(deleteButton2)

                $('#main-post').append(editButton2)
                $('#main-post').append(deleteButton2)
            
            },
            error: (response)=>{
            console.log('unsuccsessful edit')
            $('#main-post-error').empty()
            $('#main-post-error').append("Error: " + response)
                }
            });

    }catch(e){
        console.log('unsuccsessful edit')
        $('#main-post-error').empty()
        $('#main-post-error').append("Error: " + e)

    }
    })
}

function deletePostEvent(btn) {
    /**This function sends a delete request to the server, deleting the main post. */
    btn.on('click', function (event) {
      //1. prevent default
      event.preventDefault()
      $.ajax({
        method: "DELETE",
        url: `/forum/${postId}`,
        success: (response)=>{
            $('#post-thread').empty()
            $('#comment-form-container').empty()
            $('#post-thread').append('<p>Post deleted successfully</p>')
        },
        error: (response)=>{
         console.log('unsuccsessful deletion')
         $('#main-post-error').empty()
          $('#main-post-error').append("Error: " + response)

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
}

function stringChecks(strings){
    /**Takes an array as an argument, where the array contains the data you want to validate */
    strings.forEach(e => {
        if(!(isNaN(e))) throw "Post title, body, and comments must be strings!"
        e = e.trim()
        if(e.length < 1) throw "All strings must be at least 1 character!"
        
    });
    return
}