function checkExercise(name){
    if(!name){
        throw "Enter an exercise!!!"
    }
    if(typeof(name)!=='string')
    {
        throw "Exercise must be a string!!!"
    }
}

function checkCalories(calories){
    if(!calories){
        throw "Enter number of calories!!!"
    }
    if(typeof(calories)!=='number')
    {
        throw "Calories must be a number!!!"
    }
}

module.exports = {
    checkCalories,
    checkExercise
}