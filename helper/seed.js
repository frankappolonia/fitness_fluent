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
    await deleteAllPosts()
    console.log("Users collection Emptied. Beginning seeding:")

    try {
        //users
        let joeId = await userFuncs.createUser('joe', 'smith', 'test@gmail.com', 'password', '1994-02-15', 72, 185, 'male', 'sedentary', 1, 0)
        await userFuncs.logCurrentWeight(joeId, 187, "2022-04-30")
        await userFuncs.logCurrentWeight(joeId, 188, "2022-05-07")
        await userFuncs.logCurrentWeight(joeId, 189, "2022-05-11")
        await userFuncs.logCurrentWeight(joeId, 189, "2022-05-15")
        await userFuncs.logCurrentWeight(joeId, 186, "2022-05-21")

        let ericaId = await userFuncs.createUser('Erica', 'smith', 'test2@gmail.com', 'password', '2004-03-15', 60, 115, 'female', 'moderate', 0, 0)
        await userFuncs.logCurrentWeight(ericaId, 118, "2022-04-30")
        await userFuncs.logCurrentWeight(ericaId, 115, "2022-05-11")

        let frankId = await userFuncs.createUser('Frank', 'Jones', 'test3@gmail.com', 'password', '1999-02-15', 68, 162, 'male', 'heavy', 0, 0)
        await userFuncs.logCurrentWeight(frankId, 160, "2021-12-30")
        await userFuncs.logCurrentWeight(frankId, 161, "2022-01-11")
        await userFuncs.logCurrentWeight(frankId, 162, "2022-02-11")
        await userFuncs.logCurrentWeight(frankId, 163, "2022-03-11")
        await userFuncs.logCurrentWeight(frankId, 163, "2022-04-11")
        await userFuncs.logCurrentWeight(frankId, 163, "2022-04-26")

        let adminId = await userFuncs.createUser('Admin', 'James', 'admin@gmail.com', 'password', '1985-06-17', 74, 198, 'male', 'moderate', 2, 1234)



        let post1 = await postFuncs.addPost('Are carbs good for you?', 
        'Hi, i was wondering what your guys opion on carbs is?', ericaId)
        await postFuncs.addComment(post1, joeId, "I think carbs are very good for you. To lose weight, what is most important is calories in and calories out, rather then macros.")
        let comment1 = await postFuncs.addComment(post1, ericaId, "Thats a good point, thanks Joe!")
        //await postFuncs.deleteComment(comment1, frankId)

        let post2 = await postFuncs.addPost('Best exercises for chest', 
        'Greetings! I am a bodybuilder looking to add mass to my chest. I was wondering what chest exercises you find to be most effective?',
        joeId)
        await postFuncs.addComment(post2, frankId, "Overall, i'd say the barbell bench press is the best exercise for growing chest mass. This is because it is the exercise that you can most consistently progressivley overload on.")

        let post3 = await postFuncs.addPost('Best exercises for legs', 
        'What do you guys think will build up your quad muscles the most?',
        joeId)
        await postFuncs.addComment(post3, frankId, "Overall, i'd say the barbell squat. It is a compound movement that does a good job recruiting all of the muscles in your legs.")
        await postFuncs.addComment(post3, ericaId, "I'd also add that the deadlift is another great compound movement that recruits leg muscles efficiently.")


    } catch (error) {
        console.log(error)
        
    }

    console.log("Users collection seeded!")
    console.log("Posts collection seeded!")
    await connection.closeConnection();

}


seed()
