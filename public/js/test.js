function dobValidation(date){
    /**Checks date. Must be in YYYY-MM-DD format */
    if (arguments.length !== 1) throw "invalid number of arguments for date validation"

    date = date.trim()
    if (date.length !== 10 ) throw "Incorrect date length! Must be YYYY-MM-DD"
    if(date.charAt(4) !== "-" || date.charAt(7) !== '-') throw "Incorrect date format! Must be YYYY-MM-DD"
    function numberCheck(num){
        if(isNaN(num)) throw "Date is not a valid number!"
        if(num%1 !== 0) throw "Date cannot be a decimal!"
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

    let currentDay = new Date()
    let birth = new Date(date)
    let years = Math.abs(currentDay.getTime() - birth.getTime())/1000/60/60/24/365
    console.log(years)
    if (years < 12) throw "Must be at least 12 years old to signup!"
    
    return

}

try {
    console.log(dobValidation('2020-02-15'))
} catch (error) {
    console.log(error)
    
}