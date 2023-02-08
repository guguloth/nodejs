const express = require('express');
const http  =require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const hostname = "localhost";
const port = "3000";

const app = express();
app.use(morgan('dev'));

// Both below methods can be used 

// app.use(bodyParser.urlencoded({
//     extended:true
// }));
// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.all('/dishes',(req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
});

app.get('/dishes',(req,res,next) => {
    res.end('we will send all dishes information to you');
});

app.post('/dishes',(req,res,next) => {
    res.end("will add the dishes:" + req.body.name + " with details: "
             + req.body.description);
});

app.put('/dishes',(req,res,next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suported on /dishes");
});

app.delete('/dishes',(req,res,next) => {
    res.end('Deleting all dishes!');
});

app.get('/dishes/:dishId',(req,res,next) => {
    res.end('we will send details of dish ' + req.params.dishId + " to you.");
});

app.post('/dishes/:dishId',(req,res,next) => {
    res.statusCode = 403;
    res.end("POST operation is not suported on /dishes/" + req.params.dishId);
});

app.put('/dishes/:dishId',(req,res,next) => {
    res.write("Updating the dish:" + req.params.dishId + "\n");
    res.end("will add the dishes:" + req.body.name + " with details: "
            + req.body.description);
});

app.delete('/dishes/:dishId',(req,res,next) => {
    res.end('Deleting dishe' + req.params.dishId);
});

app.use(express.static(__dirname + "/public"));

app.use((req,res,next) => {
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader("Content-Type","text/html");
    res.end("<html><body><h1>This is express server</h1></body></html>")
});

const server = http.createServer(app);

server.listen( port, hostname, () =>{
    console.log(`Server running at hppt://${hostname}:${port}`);
});