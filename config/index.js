const collections = require('./mongoCollections')
const mongoConnection = require('./mongoConnection')

module.exports = {
    usersCollection: collections.users,
    foodCollection: collections.recomendedFoods,
    postsCollection: collections.posts,
    connection: mongoConnection
};