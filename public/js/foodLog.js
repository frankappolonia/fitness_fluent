$(document).ready(function () {
  $("button.delete").click(function () {
    console.log("delete button clicked");
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
    console.log(e.target.value);
    location.replace(`/food-log/${e.target.value}`);
  });

  //food journal search functionality
  $("#search").click((event) => {
    event.preventDefault();
    console.log("button clicked");
    let searchTerm = $("#food").val();

    $.ajax({
      type: "GET",
      url: `/food-log/search/${searchTerm}`,
    }).done((data, status) => {
      if (status !== "success") {
        alert("Error: " + status);
      } else {
        console.log("data", data);
        let row = data
          .map(
            (item, index) =>
              `<tr onclick="wow(event)" class="row-select" id="suggestion-${index}">
            <td>${item.food.label}</td>
            <td>${Math.round(item.food.nutrients.ENERC_KCAL)}</td>
            <td>${Math.round(item.food.nutrients.PROCNT)}</td>
            <td>${Math.round(item.food.nutrients.CHOCDF)}</td>
            <td>${Math.round(item.food.nutrients.FAT)}</td>
          </tr>`
          )
          .join("");
        console.log("row", row);
        $("#suggestions").append(`${row}`);
      }
    });
  });
});

function wow(event) {
  console.log("wow", event.currentTarget);
  let food = event.currentTarget.children[0].innerText;
  let calories = event.currentTarget.children[1].innerText;
  let protein = event.currentTarget.children[2].innerText;
  let carbs = event.currentTarget.children[3].innerText;
  let fat = event.currentTarget.children[4].innerText;
  $("#food").val(food);
  $("#calories").val(calories);
  $("#protein").val(protein);
  $("#carbs").val(carbs);
  $('#fat').val(fat)
  $("#suggestions").children("tr").remove();
  
}