$("button").click(function () {
  var id = $(this).attr("id");
  let children = $("#row" + id).children();
  let foodData = {
    foodName: children[0].innerText,
    calories: children[1].innerText,
  };

  let date = $("#date").val();

  $.ajax({ type: "DELETE", url: `/food-log/${date}`, data: foodData }, function (data, status) {
    console.log(data, status
    )
  });

});
