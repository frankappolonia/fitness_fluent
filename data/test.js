const users = require('./users')
//local space to test db functions


async function testCreateUser(){
    try {
        //valid entry
        await users.createUser('frank', 'appolonia', 'fappolonia@gmail.com', 'password12', '02/15/1999', 68, 162, 'male', 'active', 0)
        
    } catch (e) {
        console.log(e)
        
    }
}

testCreateUser()