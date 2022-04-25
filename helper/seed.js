const data = require('../data')
const db = require('../config')
const userFuncs = data.userFuncs
const users = db.usersCollection
const connection = db.connection




async function deleteAllUsers(){
    const userCollection = await users()
    userCollection.deleteMany({})
}

async function seed(){
    await deleteAllUsers()
    console.log("Users collection Emptied. Beginning seeding:")

    try {
        await userFuncs.createUser('joe', 'smith', 'test@gmail.com', 'password', '1999-02-15', 72, 185, 'male', 'sedentary', 1)
        await userFuncs.logCurrentWeight('test@gmail.com', 187, "2022-04-30")
        await userFuncs.logCurrentWeight('test@gmail.com', 188, "2022-05-07")
        await userFuncs.logCurrentWeight('test@gmail.com', 189, "2022-05-11")
        await userFuncs.logCurrentWeight('test@gmail.com', 189, "2022-05-15")
        await userFuncs.logCurrentWeight('test@gmail.com', 186, "2022-05-21")

        await userFuncs.createUser('Erica', 'smith', 'test2@gmail.com', 'password', '2004-03-15', 60, 115, 'female', 'moderate', 0)
        await userFuncs.logCurrentWeight('test2@gmail.com', 118, "2022-04-30")
        await userFuncs.logCurrentWeight('test2@gmail.com', 115, "2022-05-11")



    } catch (error) {
        console.log(error)
        
    }

    console.log("Users collection seeded!")
    await connection.closeConnection();

}

seed()
