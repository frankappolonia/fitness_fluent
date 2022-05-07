let editProfile = $('#edit-profile-form')
$('#edit-profile-error').hide()

editProfile.submit((event =>{
    let firstName = $('#newFirstName').val()
    let lastName = $('#newLastName').val()
    let height = $('#newHeight').val()
    let weight = $('#newWeight').val()
    let activityLevel = $('select[name=newActivityLevel] option').filter(':selected').val()
    let goal = $('select[name=newGoal] option').filter(':selected').val()

    try{
        profileUpdateValidation(firstName, lastName, height, weight, activityLevel, goal)
    }catch(e){
        event.preventDefault()
        //console.log('im here')
        $('#edit-profile-error').show()
        $('#edit-profile-error').empty()
        $('#edit-profile-error').append(e)
    }
}));


function profileUpdateValidation(firstName, lastName, height, weight, activityLevel, goal){
    /**Validates the request body data of the /signup post route */
    if(! firstName) throw "No first name given!"
    if(! lastName) throw "No last name given!"
    if(! height) throw "No height given!"
    if(! weight) throw "No weight given!"
    if(! activityLevel) throw "No activty level given!"
    if(! goal) throw "No goal specified!"
    updateUserValidation(firstName, lastName, height, weight, activityLevel, goal)

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
    args.forEach(e => {
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
    if(height !== height || weight !== weight) throw "Height and weight must be numbers!"
    if(isNaN(parseInt(height)) || isNaN(parseInt(weight))) throw "Height and weight must be numbers!"
    if(height%1 !== 0 || weight%1 !== 0) throw "Height and weight must be whole numbers!"
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

function updateUserValidation(firstName, lastName, height, initialWeight, activityLevel, weeklyWeightGoal){
    /**Wrapper function that calls all of the validation functions for the createUser db function */
    
    if(arguments.length !== 6) throw "Incorrect number of arguments!"
    //string checks
    stringChecks([firstName, lastName, activityLevel])
    stringtrim(arguments)
    //name check
    nameValidation(firstName, lastName)
    //height and weight check
    heightWeightValidation(height, initialWeight)
    //activity level check
    activityLevelValidation(activityLevel)
    //weekly weight goal check
    weeklyGoalValidation(weeklyWeightGoal)
    return
}