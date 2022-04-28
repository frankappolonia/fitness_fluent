let exerciseForm = $('#new-exercise-form')

exerciseForm.submit((event=>{
    let exercise = $('#exercisename').val()
    let calories = $('#calories').val()
    try{
        newExerciseCheck(exercise, calories)
    }catch(e){
        event.preventDefault()
        $('#newExercise-error').empty()
        $('#newExercise-error').append(e)
    }
}))

function newExerciseCheck(exercise,calories){
    if(arguments.length!==2) throw "Invalid number of arguments"
    if(!exercise) throw "No exercise entered!"
    if(!calories) throw "No calories entered!"
    if (typeof(exercise) === 'string'){
        exercise = exercise.trim()
    }else{
        throw "Exercise is not a string!!!"
    }
    if(exercise.length < 1) throw "Exercise must be at least 1 character!"
    if(calories<=0){
        throw "Calories must be always greater than 0!!!"
    }
    
}