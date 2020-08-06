# Proffy  
Proffy is a simple website made during Rocketseat's Next Level Week advanced module.
It is a platform for teachers and students to connect and arrange classes of different subjects.  
This repository contains the website's back-end, providing a RESTful API for a few database communication functions.
The front-end of the website can be found [here](https://github.com/Vernalhav/nlw-proffy/).

# API  
 This API provides only 4 functionalities, as follows:  
 - **POST**  
    - `/classes`: creates a new Teacher, with their information, their class information and their available schedule.  
    - `/connections`: creates a new connection with a certain Teacher. Used to display total connections number in the site's homepage.
- **GET**
    - `/classes`: lists all teachers that satisfy the user's search criteria. Search by subject, time and week day.  
    - `/connections`: returns number of connections made.


# Usage  
This project requires Node.js, npm, sqlite3 and optionally Yarn.
Clone this repo and make it your working directory. Then  
`yarn install` or `npm install` to install the dependencies;  
`yarn knex:migrate` or `npm knex:migrate` to initialize the database schema;  
`yarn start` or `npm start` to run the server;  
The server will be hosted on `localhost:3333`.
