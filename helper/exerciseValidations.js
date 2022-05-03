const { type } = require("express/lib/response")

function checkExercise(name){
    if(!name){
        throw "Enter an exercise!!!"
    }
    if(typeof(name)!=='string')
    {
        throw "Exercise must be a string!!!"
    }
}



module.exports = {
    checkCalories,
    checkExercise
}