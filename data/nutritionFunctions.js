const errorHandling = require('../helper')
const validations = errorHandling.userValidations

/**Functions for calculating nutrition information for the user (BMR, BMI, TDEE, Calories Needed for
 * goals, and Macronutrient info if we ge to that) */

function calculateBMR(gender, height, weight, age){
    /**Calculation for base metabloic rate (cals needed without accounting for activity level) 
     * Precondition: gender is 'male' or 'female', height is in inches, weight is in lbs
    */
   if (arguments.length !== 4) throw "Invalid number of arguments"
   validations.genderValidation(gender)
   validations.heightWeightValidation(height, weight)
   let BMR;

   if (gender === 'male'){
        BMR = 66 + (6.2 * weight) + (12.7 * height) - (6.76 * age)
   }
   else if (gender === 'female'){
        BMR = 655.1 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
   }
   return Math.round(BMR)
}

function calculateTDE(activityLevel, gender, height, weight, age){
    /**Calculation for total daily energy expenditure (total cals spent each day) */
    if(arguments.length !== 5) throw "Invalid number of arguments!"
    validations.activityLevelValidation(activityLevel)
    let BMR = calculateBMR(gender, height, weight, age)

    let activityLevels = {'sedentary':1.2, 'light':1.375, 'moderate':1.55, 'heavy':1.725, 'hardcore':1.9}
    let TDEE = activityLevels[activityLevel] * BMR
    return Math.round(TDEE)

}

function calculateCalsNeeded(weeklyGoal, TDEE){
    if (arguments.length !== 2) throw "Invaliad number of arguments"
    validations.weeklyGoalValidation(weeklyGoal)
    weeklyGoal = parseInt(weeklyGoal)

    switch (weeklyGoal){
        case -2: 
            return TDEE - 1000 //lose two pounds per week
        case -1: 
            return TDEE - 500 // lose one pounds per week
        case -0:
            return TDEE      // maintain current weight per week
        case 1:
            return TDEE + 500 // gain one pounds per week
        case 2:
            return TDEE + 1000 // gain two pounds per week
    }

}



function calculateAge(dob){
    //https://www.codegrepper.com/code-examples/javascript/javascript+get+age+by+birth+date
    if (arguments.length !== 1) throw "Invalid arguments"
    validations.dobValidation(dob)
    let today = new Date()
    let birthday = new Date(dob)
    let age = today.getFullYear()- birthday.getFullYear()
    let month = today.getMonth() - birthday.getMonth()
    if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())){
        age--
    }
    
    return age
}

function calculateMacroBreakdown(dailyCals, carbs, fat, protein){
    if (arguments.length !== 4) throw "Invalid number of arguments"
    validations.checkMacroGoal(dailyCals, carbs, fat, protein)

    let carbCals = parseFloat(dailyCals) * parseFloat(carbs)
    let fatCals = parseFloat(dailyCals) * parseFloat(fat)
    let proteinCals = parseFloat(dailyCals) * parseFloat(protein)

    let totalCarbs = Math.round(carbCals/4)
    let totalFat = Math.round(fatCals/9)
    let totalProtein = Math.round(proteinCals/4)

    let macroBreakdown = {"carbs": totalCarbs, "fats": totalFat, "protein": totalProtein}
    return macroBreakdown

}

function calculateBMI(height, weight){
    validations.heightWeightValidation(height, weight)
    let bmi = parseFloat(((weight*703)/ Math.pow(height, 2)).toFixed(1))
    return bmi
}


module.exports = {
    calculateBMR, 
    calculateTDE, 
    calculateCalsNeeded,
    calculateAge,
    calculateMacroBreakdown,
    calculateBMI
}