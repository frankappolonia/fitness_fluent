$("button").click(function () {
  var id = $(this).attr("id");
  let children = $("#row" + id).children();
  if (children.length > 1) {
    let foodData = {
      foodName: children[0].innerText,
      calories: children[1].innerText,
    };
    let date = $("#date").val();

    $.ajax({ type: "DELETE", url: `/food-log/${date}`, data: foodData }).done(
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
    console.log(e.target.value)
    location.replace(`/food-log/${e.target.value}`);
  });
  


$('#food-log-form').submit((event=>{
  //error checking

  //adds the date input to the form submit
  let date = $("<input>")
               .attr("type", "hidden")
               .attr("name", "date").val($('#date').val());
  $('#food-log-form').append(date);

}));


//food journal search functionality

$('#food-journal').submit((event=>{
  event.preventDefault()
  let searchTerm = $('#foodItem').val()
  
  try {
    $.ajax({
      async: true,
      crossDomain: true,
      dataType:"json",
      method: "GET",
      url: `https://edamam-food-and-grocery-database.p.rapidapi.com/parser?ingr=${searchTerm}`,
      headers: {
          'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com',
          'X-RapidAPI-Key': 'e15ac27b41msh078c9a4ba21df70p1b9e03jsna2a33f434dd6'
        },
      success: (response)=>{
          let data = filterFoodSearch(response.hints)
          $('#results-div').empty()
          $('#results-div').append(data)

      },
      error: (response)=>{
        $('#food-journal-error').append(response)

      }
  })
    
  } catch (error) {
    $('#food-journal-error').empty()
    $('#food-journal-error').append(e)
    
  }
}));

function filterFoodSearch(results){

  let data = []
  results.forEach(foodObj =>{
    let food ={}
    food['name'] = foodObj.food.label
    food['calories'] = Math.round(foodObj.food.nutrients.ENERC_KCAL)
    food['protein'] = Math.round(foodObj.food.nutrients.PROCNT)
    food['carbs'] = Math.round(foodObj.food.nutrients.CHOCDF)
    food['fat'] = Math.round(foodObj.food.nutrients.FAT)
    data.push(food)
  })

  data = data.slice(0,5)

  let formOptions = ""
  data.forEach(foodObj =>{

    formOptions += `<option value="${foodObj}">${foodObj.name} | Calories: ${foodObj.calories} | Carbs: ${foodObj.carbs} | Fat: ${foodObj.fat} | Protein: ${foodObj.protein}</option>  `
  })

  let selectResultForm = $(
    `<form method="post" action="/food-log/database">` +
    `<label for="foodJournalSelection">Choose a food:</label>` +
    `<select id="foodJournalSelection" name="foodJournalSelection" size="3">` +
    `${formOptions}`+
    `</select>`+
    `<button class="btn btn-primary" type="submit">Enter Food</button>`+
    `</form>`
  )

  return selectResultForm

}

