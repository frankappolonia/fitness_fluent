
$('#progress-form').submit((event=>{
    event.preventDefault()
    let startDate = $('#startDate').val()
    let endDate = $('#endDate').val()
    try{
        progressValidation(startDate, endDate)
    }catch(e){
        $('#progress-graph-error').empty()
        $('#progress-graph-error').append(e)
    }
    let requestConfig = {
        method: 'GET',
        url: '/progress/customrange',
        contentType: 'application/json',
        data: JSON.stringify({
          start: startDate,
          end: endDate
        })
      };

      $.ajax({
          method: "POST",
          url: '/progress',
          contentType: 'application/json',
          data: JSON.stringify({
            start: startDate,
            end: endDate
          }),
          success: (response)=>{
              console.log(response)
    

          },
          error: (response)=>{

          }
      })
      
      //$.ajax(requestConfig).then(event =>{
        //console.log('success')
      //})
    
}));

/**Validations */
function progressValidation(start, end){
    /**Wrapper function for the form validations of the progress page */
    if(arguments.length !== 2) throw "Invalid"
    stringtrim(arguments)
    stringChecks([start, end])
    dateValidation(start)
    dateValidation(end)
}

function stringtrim(arguments){
    /**Takes the arguments object of a function and trims all string types */
    for (arg in arguments){
        if (typeof(arguments[arg]) === 'string'){
            arguments[arg] = arguments[arg].trim()
        }
    }
    return 
}

function stringChecks(args){
    /**Takes an array as an argument, where the array contains the data you want to validate */
    args.forEach(e => {
        if(typeof(e)!== 'string') throw "An argument is not a string!"
        e = e.trim()
        if(e.length < 1) throw "All strings must be at least 1 character!"
        
    });
    return
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
    return

}


/**Graph functions */
const ctx = $('#myChart') 
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});