const axios = require("axios");

async function searchFood(food){
    const options = {
        method: 'GET',
        url: 'https://edamam-food-and-grocery-database.p.rapidapi.com/parser',
        params: {ingr: food},
        headers: {
          'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com',
          'X-RapidAPI-Key': 'e15ac27b41msh078c9a4ba21df70p1b9e03jsna2a33f434dd6'
        }
      };
      
      let {data} = await axios.request(options)
      let foods = data.hints //this is an array of food objects, each object being a food that came up in the search
      console.log(foods)

}

searchFood('cheeseburger')
