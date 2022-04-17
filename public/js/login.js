let login = $('#login-form')

login.submit((event=>{
    let email = $('#username')
    let password = $('#password')
    try{
        validateLogin(email, password)
    }catch(e){
        event.preventDefault()
        $('#login-error-container').empty()
        $('#login-error-container').append(e)
    }

}))

function validateLogin(username, password){
    if(! username) throw "No username given!"
    if(! password) throw "No password given!"
    checkUsername(username)
    checkPassword(password)
    return
}

function checkUsername(username){
    if(typeof(username) !== 'string') throw "Error! Username must be a string!"
    username = username.trim()
    //email validation here
    
    username = username.toLowerCase()
    return username
}

function checkPassword(password){
    if (typeof(password) !== 'string') throw "Error! Password must be a string!"
    password = password.trim()
    if(password.search(" ") !== -1) throw "Error! Password cannot contain spaces!"
    if(password.length < 6) throw "Error! Password must be at least 6 characters!"
    return password
}