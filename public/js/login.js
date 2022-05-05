let login = $('#login-form')

$('#login-error-container').hide()

login.submit((event=>{
    /**Callback function that gets the values from the login form and runs validations.
     * Prevents the default action if any checks fail
     */
    let email = $('#username').val()
    let password = $('#password').val()
    try{
        $('#login-error-container2').empty()
        validateLogin(email, password)
        $('#username').val(email.toLowerCase())

      
    }catch(e){
        event.preventDefault()
        $('#login-error-container').show()
        $('#login-error-container').empty()
        $('#login-error-container').append(e)

    }

}));

/**Validations for above */

function validateLogin(username, password){
    if(! username) throw "No username given!"
    if(! password) throw "No password given!"
    checkUsername(username)
    checkPassword(password)
    return
}

function checkUsername(username){
    if(!(isNaN(username))) throw "Error! Username must be a string!"

    let email = username.trim()
    email = email.trim()
    if (email.search(/[.]/g) === -1) throw "Invalid domain format, must include '.' puncation!"//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search
    if (email.search('@')=== -1) throw "Invalid, must include @"
    if (email.search('@') === 0 || email.search(/[.]/g) === 0) throw "Invalid, cannot have . or @ at the beginning"

    if(! /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/.test(email)) throw "Invalid email!"
    if((email.match(/@/g) || []).length > 1) throw "Invalid, cannot have multiple @s"
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
    if (! (isNaN(password))) throw "Error! Password must be a string!"
    password = password.trim()
    if(password.search(" ") !== -1) throw "Error! Password cannot contain spaces!"
    if(password.length < 6) throw "Error! Password must be at least 6 characters!"
    return password
}