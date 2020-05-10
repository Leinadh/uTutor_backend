const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./src/models/database');
const student = require('./src/models/student');
dotenv.config();

/* sample draft server 
* Author: Jin Jose Manuel
* Date: 20/04/2020
**/


app = express();

app.use(express.json());

// Settings
app.set("port", process.env.PORT || 3000)

app.use(require('./src/routes/studentRoutes'))

/*app.get('/conection', (req,res)=>{
    res("Conection established! ");
});*/

/*app.get('/api/students', (req,res)=>{
    const students = [
        {
            id: 1, name: "Jin", term:8, courses:[
                {cod: "INF245", name: "Ingenieria de Software"},
                {cod: "IND275", name: "Control de gestion industrial"},
                {cod: "INF238", name: "Redes de computadoras"}
            ]
        },
        {
            id: 2, name: "Tys", term:8, courses:[
                {cod: "INF245", name: "Ingenieria de Software"},
                {cod: "IND275", name: "Control de gestion industrial"},
                {cod: "INF238", name: "Redes de computadoras"},
                {cod: "1EST07", name: "Experimentacion numérica"},
            ]
        }
    ]
    res.json(students);
    
});*/


app.listen(app.get('port'), ()=> console.log(`Server runing on port ${app.get('port')}`));