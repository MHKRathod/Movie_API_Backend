const express = require('express');
const mySqlPool = require('./config/db');

const moviesRouter = require('./router/moviesRouter');
const actorsRouter = require('./router/actorsRouter');
const actorsAndDirectorsRouter = require('./router/actorAndDirectorRouter');

//rest object
const app = express();

//middleware
app.use(express.json());

//routes
app.get('/',(req,res) => {
    res.status(200).send("hi hari");
})
app.use('/api',moviesRouter);
app.use('/api',actorsRouter);
app.use('/api',actorsAndDirectorsRouter);

//port
const PORT = 8000;


//conditional listen
mySqlPool
    .query("SELECT 1")
    .then(() => {
    console.log("Connected to MySQL");
     
    app.listen(PORT,()=>{
        console.log("server is running hari")
    });
    })
    .catch((err) => {
        console.log("Error connecting to MySQL", err);
    });

