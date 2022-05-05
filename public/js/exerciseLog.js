$("button").click(function () {
    var id = $(this).attr("id");
    let children = $("#row" + id).children();
    if (children.length > 1) {
      let exerciseData = {
        exerciseName: children[0].innerText,
        calories: children[1].innerText,
      };
      let date = $("#date").val();
  
      $.ajax({ type: "DELETE", 
                url: `/exercise-log/${date}`, 
                data: exerciseData }).done(
        function (data, status) {
          if (status !== "success") {
            alert("Error: " + status);
          } else {
            location.reload();
          }
        }
      );
    }
  });
  
  $("#date").change(function (e) {

      try{
        exerciseFoodLogDateValidation(e.target.value)
        location.replace(`/exercise-log/${e.target.value}`);

      }catch(error){
        $('#exercise-log-error').show()
        $('#exercise-log-error').empty()
        $('#exercise-log-error').append(error)
      }
    });

//validations
$('#exercise-log-form').submit((event =>{
  let date = $('#date').val()
  let exercise = $('#exercise').val()
  let calories = $('#calories').val()

  try {
    $('#food-log-error').empty()
    validateNewExercise(date, exercise, calories)

  } catch (error) {
    event.preventDefault()
        $('#exercise-log-error').show()
        $('#exercise-log-error').empty()
        $('#exercise-log-error').append(error)
  }

}));

function validateNewExercise(date, exercise, calories){
  if(! date) throw "No date given!"
  if(! exercise) throw "No exercise given!"
  if(! calories) throw "No calories given!"

  stringChecks([date, exercise])
  stringtrim(arguments)
  exerciseFoodLogDateValidation(date)
  checkCalories(calories)
}


function checkCalories(calories){
  if(arguments.length !== 1) throw "Invalid number of arguments!"
  if(calories !== calories) throw "Calories is not a number!"
  if(isNaN(parseInt(calories))) throw "Calories is not a number!"
  if(calories % 1 !== 0) throw "Calories must be a whole number!"
  calories = parseInt(calories)
  if(typeof(calories) !== 'number') throw "Calories must be a number!"
  if(calories < 1) throw "Calories must be a number greater than 1!"
  if(calories > 2000) throw "Maximum calorie value is 2000!"
}
    
function dateValidation(date){
  /**Checks date. Must be in YYYY-MM-DD format */
  if (arguments.length !== 1) throw "invalid number of arguments for date validation"

  date = date.trim()
  if (date.length !== 10 ) throw "Incorrect date length!"
  if(date.charAt(4) !== "-" || date.charAt(7) !== '-') throw "Incorrect date format!"
  function numberCheck(num){
      if(isNaN(num)) throw "Date is not a valid number!"
      if(num%1 !== 0) throw "Date cannot be a decimal ID!"
      return num
  }
  const monthKey = {'1':31, '2':28, '3':31, '4':30, '5':31, '6':30, 
  '7':31, '8':31, '9':30, '10':31, '11':30, '12':31}
  let month = parseInt(numberCheck(date.slice(5, 7)))
  let day = parseInt(numberCheck(date.slice(8)))
  let year = parseInt(numberCheck(date.slice(0,4)))
  if (month < 1 || month > 12) throw "Invalid month!"
  if (year < 1900 || year > 2022) throw "Invalid year"
  if(day > monthKey[month] || day < 1){throw "Invalid day!"}

}

function exerciseFoodLogDateValidation(date){
//first checks if its a valid date
  dateValidation(date)
  //date = new Date(date)
  if(compareDates(date) === false) throw "Cannot use a date later than the current date!"
}

function stringtrim(argsObj){
  /**Takes the arguments object of a function and trims all string types */
  for (arg in argsObj){
      if (typeof(argsObj[arg]) === 'string'){
          argsObj[arg] = argsObj[arg].trim()
      }
  } 
}

function stringChecks(strings){
  /**Takes an array as an argument, where the array contains the data you want to validate */
  strings.forEach(e => {
      if(typeof(e)!== 'string') throw "An argument is not a string!"
      e = e.trim()
      if(e.length < 1) throw "All strings must be at least 1 character!"
      
  });
}

function compareDates(date){
  let currentDate = new Date(new Date().toLocaleDateString())
  let enteredDate = new Date(new Date(date).toLocaleDateString())

  console.log(currentDate)
  console.log(enteredDate)

  if (currentDate.getFullYear() < enteredDate.getFullYear()) return false

  if (currentDate.getFullYear() === enteredDate.getFullYear()){

      if(currentDate.getMonth() < enteredDate.getMonth()) return false
      if(currentDate.getMonth() === enteredDate.getMonth()){
          if(currentDate.getDate() < enteredDate.getDate()) return false
      }
    }

  return true

}