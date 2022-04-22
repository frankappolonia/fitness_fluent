let login = $('#login-form')

login.submit((event=>{
    let email = $('#username').val()
    let password = $('#password').val()
    console.log('jquery test')
    try{
        validateLogin(email, password)
        $('#username').val(email.toLowerCase())
      
    }catch(e){
        event.preventDefault()
        $('#login-error-container').empty()
        $('#login-error-container').append(e)
    }

}));

function validateLogin(username, password){
    if(! username) throw "No username given!"
    if(! password) throw "No password given!"
    checkUsername(username)
    checkPassword(password)
    return
}

function checkUsername(username){
    if(typeof(username) !== 'string') throw "Error! Username must be a string!"

    let email = username.trim()
    email = email.trim()
    if (email.search(/[.]/g) === -1) throw "Invalid domain format, must include '.' puncation!"//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search
    if (email.search('@')=== -1) throw "Invalid, must include @"
    if (email.search('@') === 0 || email.search(/[.]/g) === 0) throw "Invalid, cannot have . or @ at the beginning"

    if(! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw "Invalid, cannot have multiple @s"
    if(! /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(email)) throw "Invalid email!"

    let domain = email.slice(email.search('@'))
    function properDotFormat(domain){
        let lastDotIndex = 0
        let count = 0
        for(e of domain){
            if(e === '.'){lastDotIndex = count}
            if (lastDotIndex === 1) throw "Invalid, must have a character after the @"
            count += 1
        }
        if ((domain.length-1) - lastDotIndex < 2) {throw "Invalid format! Must be at least two character after last '.'"}
     
    }
    properDotFormat(domain)
    
    email = email.toLowerCase()
    return email
}

function checkPassword(password){
    if (typeof(password) !== 'string') throw "Error! Password must be a string!"
    password = password.trim()
    if(password.search(" ") !== -1) throw "Error! Password cannot contain spaces!"
    if(password.length < 6) throw "Error! Password must be at least 6 characters!"
    return password
}