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
      console.log(e.target.value)
      location.replace(`/exercise-log/${e.target.value}`);
    });
    
  