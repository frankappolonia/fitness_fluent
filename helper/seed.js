const data = require('../data')
const db = require('../config')
const userFuncs = data.userFuncs
const postFuncs = data.postFuncs
const users = db.usersCollection
const posts = db.postsCollection
const connection = db.connection



/**Users empty*/
async function deleteAllUsers(){
    const userCollection = await users()
    userCollection.deleteMany({})
}

/**Posts empty */
async function deleteAllPosts(){
    const postsCollection = await posts()
    postsCollection.deleteMany({})
}


async function seed(){
    await deleteAllUsers()
    console.log("Users collection Emptied. Beginning seeding:")

    try {
        //users
        let joeId = await userFuncs.createUser('joe', 'smith', 'test@gmail.com', 'password', '1999-02-15', 72, 185, 'male', 'sedentary', 1)
        await userFuncs.logCurrentWeight(joeId, 187, "2022-04-30")
        await userFuncs.logCurrentWeight(joeId, 188, "2022-05-07")
        await userFuncs.logCurrentWeight(joeId, 189, "2022-05-11")
        await userFuncs.logCurrentWeight(joeId, 189, "2022-05-15")
        await userFuncs.logCurrentWeight(joeId, 186, "2022-05-21")

        let ericaId = await userFuncs.createUser('Erica', 'smith', 'test2@gmail.com', 'password', '2004-03-15', 60, 115, 'female', 'moderate', 0)
        await userFuncs.logCurrentWeight(ericaId, 118, "2022-04-30")
        await userFuncs.logCurrentWeight(ericaId, 115, "2022-05-11")

        await postFuncs.addPost('Are carbs good for you?', 
        'Hi, i was wondering what your guys opion on carbs is?', ericaId)

        await postFuncs.addPost('Best exercises for chest', 
        'Greetings! I am a bodybuilder looking to add mass to my chest. I was wondering what chest exercises you find to be most effective?',
        joeId)


    } catch (error) {
        console.log(error)
        
    }

    console.log("Users collection seeded!")
    console.log("Posts collection seeded!")
    await connection.closeConnection();

}





seed()
