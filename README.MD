![fitnessfluent](https://user-images.githubusercontent.com/20481090/169531959-36615631-d50b-4267-ad68-03032a5ec8fc.png)


FitnessFluent is a full-stack web application built using JavaScript, Node.js, express.js, MongoDB, jQuery, Axios, handlebars.js, and bootstrap. FitnessFluent is a nutrition app that provides various functions for users to track their fitness and nutrition goals.

**Core Features:**
1. Food Log - Allows users to track their daily caloric intake. Users can either enter their own food, or search the Edamam food database via a REST API.
2. Macro tracking - In addition to tracking food calories, users can set macro goals and track the number of macros they consume.
3. Exercise Log - Allows users to track their daily caloric expenditure from exercise. Users can enter their own exercises and the number of calories it burned.
4.  Nutrition profile - Users can specify their weight gain/loss goal, as well as their macro breakdowns, and enter various kinds of nutritional information like daily activity level, height, etc.
5. Progress Page - Provides statistical information with chart.js that shows the user their weight progress over a specified period of time.
6. Daily Goals Widget - A widget on every page that displays the user's daily remaining calories and macros.
7. Fitness Discussion Forum - A basic forum for users to discuss fitness and nutrition related topics.
8. User authentication - This application utilizes express.js and bCrypt for secure user authentication and login.


**To run this application:**

1. download Node.js 
2. download the files from this repo
3. run the command "npm install" in Node to install the required dependencies in the package.json
4. run the command "npm run seed" to populate your local db with initial data
5.  Run the app.js file or type 'npm start', and go to http://localhost:3000/
6. To see the pre-defined accounts populated from seed.js, sign into one of the following:
    - test@gmail.com
    - test2@gmail.com
    - test3@gmail.com
    - admin@gmail.com
    
*test@gmail.com has the most data. it has food and exercises for 3 days, from 5/6 - 5/8
*all test accounts and admin account have the same password of 'password'
*If you choose to signup a new account, and would like it to be an admin account, the code
    is '1234'

