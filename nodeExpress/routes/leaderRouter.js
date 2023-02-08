const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end('we will send all leader information to you');
})
.post((req,res,next) => {
    res.end("will add the leader:" + req.body.name + " with details: "
             + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suported on /leader");
})
.delete((req,res,next) => {
    res.end('Deleting all leader!');
});


leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    res.end('we will send details of leader ' + req.params.leaderId + " to you.");
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST operation is not suported on /leader/" + req.params.leaderId);
})
.put((req,res,next) => {
    res.write("Updating the leader:" + req.params.leaderId + "\n");
    res.end("will add the leader:" + req.body.name + " with details: "
            + req.body.description);
})
.delete((req,res,next) => {
    res.end('Deleting leader' + req.params.leaderId);
});

module.exports = leaderRouter;