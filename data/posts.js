const db = require('../config')
const posts = db.postsCollection
const userFuncs = require('./users')
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const { ObjectId} = require('mongodb');


async function addPost(title, body, posterId) {
    /**Function that creates a new post and adds it to the posts collection 
     * Returns the post object id
    */

    //1. validate arguments
    if(arguments.length !== 3) throw "Invalid number of arguments!"
    validations.stringChecks([title, body, posterId])
    validations.stringtrim(arguments)
    posterId = validations.checkId(posterId)
    
    //2. establish connection to db
    const postCollection = await posts();

    //3. check that the user exists
    const userThatPosted = await userFuncs.getUserById(posterId);

    //4. create a new post object
    let newPost = {
      title: title,
      body: body,
      poster: {
        id: posterId,
        name: `${userThatPosted.firstName} ${userThatPosted.lastName}`
      },
      comments: []
    };

    //5. insert the new post
    const addPost = await postCollection.insertOne(newPost);
    if (!addPost.insertedId) throw 'Error: post failed!';

    //6. return post id
    return addPost.insertedId.toString()
}

async function getPostById(postId){
    //1. validate arguments
    if (arguments.length!== 1) throw "Invalid number of arguments"
    validations.stringChecks([postId])
    postId = validations.checkId(postId)

    //2. establish connection to db
    const postCollection = await posts();

    //3. query db for post
    const findPost = await postCollection.findOne({_id: ObjectId(postId)})
    if(findPost === null) throw "Post not found!"

    //4.return the post
    return findPost

}

async function deletePost(userId, postId){
    /**Deletes a post from the db collection. The userId passed in must match the poster id
     * in the post document, because the only person who can delete posts is the person who posted it.
    */
    //1. validate arguments
    if(arguments.length !== 2) throw "Invalid number of arguments"
    validations.stringChecks([userId, postId])
    userId = validations.checkId(userId)
    postId = validations.checkId(postId)

    //2. establish connection to db
    const postCollection = await posts();

    //3. ensure that the post exists
    let findPost = await getPostById(postId)
    if (findPost === null) throw "Post not found!"

    //4. ensure that the person deleting the post owns it
    if(findPost.poster.id.toString() !== userId) throw "Error! You are not authorized to delete this post!"

    //5. delete the post
    let del = await postCollection.deleteOne({ _id: ObjectId(postId) })
    if (del.deletedCount === 0)
      throw `Could not delete post with id of ${postId}`;

    return true
}

async function addComment(postId, userId, body){
    /**Adds a comment to an existing post */

    //1. validate 
    if(arguments.length !== 3) throw "invalid number of arguments"
    validations.stringChecks([postId, userId, body])
    validations.stringtrim(arguments)
    postId = validations.checkId(postId)
    userId = validations.checkId(userId)

    //2. establish connection to db
    const postCollection = await posts();

    //3. ensure that the post exists
    let findPost = await getPostById(postId)
    if (findPost === null) throw "Post not found!"

    //4. get user info and ensure the user exists
    let user = await userFuncs.getUserById(userId)
    if (user == null) throw "User not found!"

    //5. create comment
    let newComment = {
        _id: ObjectId(),
        body: body,
        poster: {
          id: userId,
          name: `${user.firstName} ${user.lastName}`
            }
      };

    //6. insert the comment
    let insertedComment = await postCollection.updateOne({ _id: ObjectId(postId) }, { $push: { comments: newComment} })
    
    //7. Check if successfully inserted
    if (insertedComment.acknowldeged === 0 || !insertedComment.insertedId === 0)
      throw 'Could not add new comment!'
    
    return newComment._id.toString()
}

async function deleteComment(commentId, posterId){
    /**Deletes a comment from a particular post. posterId must match the id of the poster in the comment
     * subdocument
     */

    //1. validate 
    if(arguments.length !== 2) throw "Invalid number of arguments!"
    validations.stringChecks([commentId, posterId])
    validations.stringtrim(arguments)
    posterId = validations.checkId(posterId)
    commentId = validations.checkId(commentId)

     //2. establish connection to db
     const postCollection = await posts();

     //3. check that the user is authorized to delete the comment
     let findComment = await postCollection.find({'comments': {$elemMatch: {'_id': ObjectId(commentId)} } }, {projection: {'comments':{$elemMatch: {'_id': ObjectId(commentId)} }, '_id':0 } } ).toArray()
     if (findComment.length === 0) throw "Error! No comment found with the specified id!" 
     let poster = findComment[0].comments[0].poster.id.toString()
     if(poster !== posterId) throw "You are not authorized to delete this comment!"

     //4. delete the comment
    let removeComment = await postCollection.updateOne({'comments': {$elemMatch: {'_id': ObjectId(commentId)} } }, { $pull: {'comments':{_id: ObjectId(commentId) }}  } )
    if (removeComment["modifiedCount"] !== 1){
        return "Error! Could not delete comment!"
    }

    return true
}


module.exports ={
    addPost,
    getPostById,
    deletePost,
    addComment,
    deleteComment
}