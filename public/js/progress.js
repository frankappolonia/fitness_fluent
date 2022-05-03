


/**Graph Stuff */
let initialGraphData;
const ctx = $('#myChart') 
let myChart

$.ajax({
    /**Ajax request for initial graph data which is executed upon page load. This request
     * gets the user's overall weight progress data, and then creates an initial graph 
     * showing their overall weight progress*/
    method: "POST",
    url: '/progress/initial_data',
    contentType: 'application/json',
    success: (response)=>{
        initialGraphData = response
        let dates = trimDates(initialGraphData.dates)
        //this creates the initial graph on the page load
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Weight (lbs)',
                    data: initialGraphData.weights,
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
    },
    error: (response)=>{
      $('#progress-graph-error').append(response)

    }
});



$('#progress-form').submit((event=>{
    /**This prevents the default action on the form submit. Instead, the form makes an AJAX
     * request with specified start and end date. The data returned will be the users weight
     * progress between those specifed dates, and then a new graph will be drawn with that data
     * upon successful request
     */
    event.preventDefault()
    $('#progress-graph-error').empty()
    let startDate = $('#startDate').val()
    let endDate = $('#endDate').val()
    try{
        progressValidation(startDate, endDate)
        $.ajax({
            method: "POST",
            url: '/progress',
            contentType: 'application/json',
            data: JSON.stringify({
              start: startDate,
              end: endDate
            }),
            success: (response)=>{
                drawChart(response)

                let weightChange = response.weightChange
                let descriptor = response.descriptor
                let htmlDescriptor
                if(weightChange == 0){
                    htmlDescriptor = $(`<p>Between the dates ${startDate} and ${endDate}, you have ${descriptor} your weight! There was no change!</p>`)
                }
                else{
                    htmlDescriptor = $(`<p>Between the dates ${startDate} and ${endDate}, you have ${descriptor} ${weightChange} pounds!</p>`)
                }
                $('#results-div').empty()
                $('#results-div').append(htmlDescriptor)
  
            },
            error: (response)=>{
              $('#progress-graph-error').append(response)
  
            }
        })
    }catch(e){
        $('#progress-graph-error').empty()
        $('#progress-graph-error').append(e)
    }
    
}));


function drawChart(data){
    /**this function draws a new graph over the initially loaded graph. It is called 
    whenever the user submits to the form. The ajax request gets data for the specific date range
    entered by the user, rather than showing overall progress like on the initial page load
    */
    let weights = data.weights
    let dates = trimDates(data.dates)
    if (weights.length === 0){
        $('#progress-graph-error').empty()
        $('#progress-graph-error').append("No weights found within the specified range!")
    }
    else{
        myChart.destroy()
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Weight (lbs)',
                    data: weights,
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
    }
}



/**Validations for above 
 * -----------------------
*/
function progressValidation(start, end){
    /**Wrapper function for the form validations of the progress page */
    if(arguments.length !== 2) throw "Invalid"
    stringtrim(arguments)
    stringChecks([start, end])
    dateValidation(start)
    dateValidation(end)
    endDateValidation(end)

    let startDate = new Date(start).getTime()
    let endDate = new Date(end).getTime()
    if (startDate > endDate) throw "Start date can't be before end date!"
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
        if(!(isNaN(e))) throw "Date must be a string in YYYY-MM-DD format!"
        e = e.trim()
        if(e.length < 1) throw "All strings must be at least 1 character!"
        
    });
    return
}

function dateValidation(date){
    /**Checks date. Must be in YYYY-MM-DD format */
    if (arguments.length !== 1) throw "invalid number of arguments for date validation"

    date = date.trim()
    if (date.length !== 10 ) throw "Incorrect date length! Must be YYYY-MM-DD"
    if(date.charAt(4) !== "-" || date.charAt(7) !== '-') throw "Incorrect date format! Must be YYYY-MM-DD"
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


function trimDates(datesArray){
    let newDates = []

    datesArray.forEach(date =>{
        newDates.push(date.slice(0,10))
    })
    return newDates
}

function endDateValidation(date){
      date = new Date(date)
      if(date.getTime() > new Date().getTime()) throw "Cannot use a date later than the current date!"
    }
    
