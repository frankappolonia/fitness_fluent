$(document).ready(function () {
  $("button.delete").click(function () {
    var id = $(this).attr("id");
    let children = $("#row" + id).children();
    if (children.length > 1) {
    try{
      $('#food-log-error').hide()
      let foodData = {
        foodName: children[1].innerText,
        calories: children[2].innerText,
        protein: children[3].innerText,
        carbs: children[4].innerText,
        fat: children[5].innerText,
      };

      let date = $("#date").val();
      //validations
      deleteRouteCheckFood(foodData, date)

      $.ajax({ type: "DELETE", url: `/food-log/${date}`, data: foodData }).done(
        function (data, status) {
          console.log(data)
          if (status !== "success") {
            alert("Error: " + status);
          } else {
            location.reload();
          }
        }
      );

    }catch(e){
      $('#food-log-error').show()
      $('#food-log-error').empty()
      $('#food-log-error').append("Error: " + e)
    }
    }
  });

  $("#date").change(function (e) {
    location.replace(`/food-log/${e.target.value}`);
  });

  //food journal search functionality
  $("#search").click((event) => {
    event.preventDefault();
    $("#suggestions").children("tr").remove();
    let searchTerm = $("#food").val();

    try{
      //validation for journal search
      $('#journal-error').empty()
      stringChecks([searchTerm])

      if (!searchTerm) {
        alert("Please enter a valid food name");
        return;
      }
      $.ajax({
        type: "GET",
        url: `/food-log/search/${searchTerm}`,
      }).done((data, status) => {
        if (status !== "success") {
          alert("Error: " + status);
        } else {
          let row = data
            .map(
              (item, index) =>
                `<tr onclick="updateEntry(event)" class="row-select" id="suggestion-${index}">
              <td>${item.food.label}</td>
              <td>${Math.round(item.food.nutrients.ENERC_KCAL)}</td>
              <td>${Math.round(item.food.nutrients.PROCNT)}</td>
              <td>${Math.round(item.food.nutrients.CHOCDF)}</td>
              <td>${Math.round(item.food.nutrients.FAT)}</td>
            </tr>`
            )
            .join("");
          $("#suggestions").append(`${row}`);
        }
      });

    }catch(e){
      $('#journal-error').empty()
      $('#journal-error').append(e)
    }

  });



});

function updateEntry(event) {
  let food = event.currentTarget.children[0].innerText;
  let calories = event.currentTarget.children[1].innerText;
  let protein = event.currentTarget.children[2].innerText;
  let carbs = event.currentTarget.children[3].innerText;
  let fat = event.currentTarget.children[4].innerText;
  $("#food").val(food);
  $("#calories").val(calories);
  $("#protein").val(protein);
  $("#carbs").val(carbs);
  $("#fat").val(fat);
  $("#suggestions").children("tr").remove();
}


//validations for enter food
//--------------------------------------

$('#food-log-form').submit((event =>{
  let date = $('#date').val()
  let food = $('#food').val()
  let calories = $('#calories').val()
  let protein = $('#protein').val()
  let carbs = $('#carbs').val()
  let fat = $('#fat').val()

  try {
    $('#food-entry-error').hide()
    checkNewFood(date, food, calories, protein, carbs, fat)
    
  } catch (error) {
    event.preventDefault()
        $('#food-entry-error').show()
        $('#food-entry-error').empty()
        $('#food-entry-error').append(error)
  }

}));


function checkHtmlTags(str) { //https://www.tutorialspoint.com/how-to-remove-html-tags-from-a-string-in-javascript
    
  str.forEach(s =>{
      if(s.match( /(<([^>]+)>)/ig)){
          throw "Cannot input html tags!"
      }
  })
}

function checkNewFood(date, foodName, calories, protein, carbs, fat){
  if(! date) throw "no date given"
  if(! foodName) throw "no food given"
  if(! calories) throw "no calories given"
  if(! protein) throw "no protein given"
  if(! carbs) throw "no carbs given"
  if(! fat) throw "no fat given"

  exerciseFoodLogDateValidation(date)
  stringChecks([foodName])
  checkCalories(calories)
  checkMacros(carbs, fat, protein)
  checkHtmlTags([date, foodName, calories, protein, carbs, fat])


}

function checkMacros(carbs, fat, protein){
  if(carbs !== carbs) throw "carbs must be a number"
  if(fat !== fat) throw "fat must be a number"
  if(protein !== protein) throw "protein must be a number"

  if (isNaN(parseFloat(carbs))) throw "carbs must be a number!"
  if (isNaN(parseFloat(fat))) throw "fat must be a number!"
  if (isNaN(parseFloat(protein))) throw "protein must be a number!"
  if(carbs.search(/e/) !== -1) throw "Invalid number!"
  if(fat.search(/e/) !== -1) throw "Invalid number!"
  if(protein.search(/e/) !== -1) throw "Invalid number!"


  if(carbs%1 !== 0) throw "Carbs must be a whole number!"
  if(protein%1 !== 0) throw "Protein must be a whole number!"
  if(fat%1 !== 0) throw "Fat must be a whole number!"

  if(carbs < 0 || fat < 0 || protein < 0) throw "Cannot set a macro value less than 0! "
  if(carbs >  1000 || fat > 1000 || protein > 1000) throw "Max macro value is 1000! "


}
function checkCalories(calories){
  if(arguments.length !== 1) throw "Invalid number of arguments!"
  if(calories !== calories) throw "Calories is not a number!"
  if(isNaN(parseInt(calories))) throw "Calories is not a number!"
  if(calories % 1 !== 0) throw "Calories must be a whole number!"
  if(calories.search(/e/) !== -1) throw "Invalid number!"

  calories = parseInt(calories)
  if(typeof(calories) !== 'number') throw "Calories must be a number!"
  if(calories > 4000) throw "Maximum calorie value is 4000!"
}

function stringChecks(strings){
  /**Takes an array as an argument, where the array contains the data you want to validate */
  strings.forEach(e => {
    if(typeof(e)!== 'string') throw "An argument is not a string!"
    e = e.trim()
    if(e.length < 1) throw "All strings must be at least 1 character!"
      
  });
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
  date = new Date(date)
  if(date.getTime() > new Date().getTime()) throw "Cannot use a date later than the current date!"
}

function deleteRouteCheckFood(requestBody, date){
  if(! date) throw "No date given!"
  if(! requestBody.foodName) throw "no food name given"
  if(! requestBody.calories) throw "no calories given"
  if(! requestBody.carbs) throw "no carbs given"
  if(! requestBody.fat) throw "no fat given"
  if(! requestBody.protein) throw "no protein given"

  checkNewFood(date, requestBody.foodName, requestBody.calories, requestBody.carbs, requestBody.fat, requestBody.protein)
}
