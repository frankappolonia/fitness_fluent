
let editProfile = $('#edit-profile-form')
$('#edit-profile-error').hide()

//validate edit profile
editProfile.submit((event =>{
    event.preventDefault()
    try{
    let firstName = $('#firstName').val()
    let lastName = $('#lastName').val()
    let height = $('#height').val()
    let activityLevel = $('select[name=activityLevel] option').filter(':selected').val()
    let goal = $('select[name=goal] option').filter(':selected').val()
    
    profileUpdateValidation(firstName, lastName, height, activityLevel, goal)
    
    $.ajax({
        method: "PATCH",
        url: '/profile/editProfile',
        contentType: 'application/json',
        data: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          height: height,
          activityLevel: activityLevel,
          goal: goal
        }),
        success: (response)=>{
            location.replace('/profile')

        },
        error: (response)=>{
            $('edit-profile-error').append(response)
            console.log('caught in request')

        }
    });

    }catch(e){
        event.preventDefault()
        $('#edit-profile-error').show()
        $('#edit-profile-error').empty()
        $('#edit-profile-error').append(e)
    }
}));

//validate log weight
let logWeight = $('#log-weight-form')
logWeight.submit((event =>{
    let weight = $('#weight').val()
    try {
        $("#log-weight-error").empty()
        heightWeightValidation(60, weight)
        
    } catch (error) {
        event.preventDefault()
        $("#log-weight-error").empty()
        $("#log-weight-error").append(error)
    }
}));

//validate update macros
let macroForm = $('#update-macros-form')
macroForm.submit((event =>{
    let carbs = $('#carbs').val()
    let fat = $('#fat').val()
    let protein = $('#protein').val()
    try{
        $("#update-macro-error").empty()
        checkMacroGoal(carbs, fat, protein)
        
    }catch(e){
        event.preventDefault()
        $("#update-macro-error").empty()
        $("#update-macro-error").append(e)
    }
}));

function profileUpdateValidation(firstName, lastName, height, activityLevel, goal){
    /**Validates the request body data of the /signup post route */
    if(! firstName) throw "No first name given!"
    if(! lastName) throw "No last name given!"
    if(! height) throw "No height given!"
    if(! activityLevel) throw "No activty level given!"
    if(! goal) throw "No goal specified!"
    updateUserValidation(firstName, lastName, height, activityLevel, goal)

    return true
}

function stringtrim(arguments){
    /**Takes the arguments object of a function and trims all string types */
    for (arg in arguments){
        if (typeof(arguments[arg]) === 'string'){
            arguments[arg] = arguments[arg].trim()
        }
    }
    return 
}

function stringChecks(args){
    /**Takes an array as an argument, where the array contains the data you want to validate */
    var letters = /^[A-Za-z]+$/;
    args.forEach(e => {
        if (!e.match(letters)){
            throw "Invalid characters!"
        }
        if(!(isNaN(e))) throw "An argument is not a string!"
        e = e.trim()
        if(e.length < 1) throw "All strings must be at least 1 character!"
        
    });
    return
}

function nameValidation(first, last){
    if (arguments.length !== 2) throw "invalid number of arguments for name validation"

    first = first.trim()
    last = last.trim()
    if (first.length < 2) throw "Firstname must be at least 2 characters!"
    if (last.length < 1) throw "Lastname must be at least 1 character!"

    return
}


function heightWeightValidation(height, weight){
    if(arguments.length !== 2) throw "invalid number of arguments for heightweight validation"

    if(! weight) throw "no weight provided!"
    if(height !== height || weight !== weight) throw "Height and weight must be numbers!"
    if(isNaN(parseInt(height)) || isNaN(parseInt(weight))) throw "Height and weight must be numbers!"
    if(height%1 !== 0 || weight%1 !== 0) throw "Height and weight must be whole numbers!"
    if(String(height).search(/e/) !== -1) throw "Invalid number!"

    height = parseInt(height)
    weight = parseInt(weight)
    if(typeof(height) !== 'number' || typeof(weight) !== 'number') throw "Height and weight must be numbers!"
    if (height < 21) throw "Must be at least 21 inches tall!"
    if (height > 107) throw "You're not that tall!"
    if (weight < 5) throw "You must weigh at least 5 pounds!"
    if (weight > 1400) throw "You're not that heavy!"
    
}

function activityLevelValidation(activity){
    if (arguments.length !== 1) throw "invalid number of arguments for activity validation"
    activity = activity.trim().toLowerCase()
    let activityLevels = {'sedentary':1.2, 'light':1.375, 'moderate':1.55, 'heavy':1.725, 'hardcore':1.9}
    if(!(activity in activityLevels)) throw "Invalid activty level"
    return
}

function weeklyGoalValidation(goal){
    /**Weekly weight loss/gain goal must be no more than + or - 2 pounds */
    if (arguments.length !== 1) throw "invalid number of arguments for goal validation"

    if(goal !== goal) throw "Goal is NaN"
    if(isNaN(parseInt(goal))) throw "Goal must be a number!"
    if(goal%1) throw "goal be a whole number!"
    goal = parseInt(goal)
    if(typeof(goal) !== 'number') throw "Goal must be a number!"
    
    if(goal > 2 || goal < -2) throw "Can only gain or lose up to a max of 2 pounds per week"
    if(goal % 1 !== 0) throw "Must be a whole number!"

}

function updateUserValidation(firstName, lastName, height, activityLevel, weeklyWeightGoal){
    /**Wrapper function that calls all of the validation functions for the createUser db function */
    
    if(arguments.length !== 5) throw "Incorrect number of arguments!"
    //string checks
    stringChecks([firstName, lastName, activityLevel])
    stringtrim(arguments)
    //name check
    nameValidation(firstName, lastName)
    //height and weight check
    heightWeightValidation(height, 80)
    //activity level check
    activityLevelValidation(activityLevel)
    //weekly weight goal check
    weeklyGoalValidation(weeklyWeightGoal)
    checkHtmlTags([firstName, lastName, height, activityLevel, weeklyWeightGoal])

    return
}

function checkMacroGoal(carbs, fat, protein){
    if(arguments.length !== 3) throw "invalid number of arguments"

    if(! carbs) throw "No carbs goal given!"
    if(! fat) throw "No fat goal given"
    if (! protein) throw "No protein goal given!"

    if(carbs !== carbs) throw "carbs must be a number"
    if(fat !== fat) throw "fat must be a number"
    if(protein !== protein) throw "protein must be a number"

    if (isNaN(parseFloat(carbs))) throw "carbs must be a number!"
    if (isNaN(parseFloat(fat))) throw "fat must be a number!"
    if (isNaN(parseFloat(protein))) throw "protein must be a number!"

    carbs = parseFloat(carbs)
    fat = parseFloat(fat)
    protein = parseFloat(protein)

    if(carbs < 0 || fat < 0 || protein < 0) throw "Cannot set a macro value less than 0%! "
    if (carbs > 1 || fat > 1 || protein > 1) throw "Cannot set a macro value above 100%"

    if((carbs + fat + protein) !== 1) throw "Macro values must add up to 100%!"

}

function checkHtmlTags(str) { //https://www.tutorialspoint.com/how-to-remove-html-tags-from-a-string-in-javascript
    
    str.forEach(s =>{
        if(s.match( /(<([^>]+)>)/ig)){
            throw "Cannot input html tags!"
        }
    })
 }