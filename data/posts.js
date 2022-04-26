const db = require('../config')
const posts = db.postsCollection
const userFuncs = require('./users')
const errorHandling = require('../helper')
const validations = errorHandling.userValidations
const { ObjectId} = require('mongodb');


async function addPost(title, body, posterId) {
    /**Function that creates a new post and adds it to the posts collection */

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

    const addPost = await postCollection.insertOne(newPost);
    if (!addPost.insertedId) throw 'Error: post failed!';

    //return this.getPostById(newInsertInformation.insertedId.toString());
    return "posted successfully!"
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



module.exports ={
    addPost,
    getPostById,
    deletePost
}