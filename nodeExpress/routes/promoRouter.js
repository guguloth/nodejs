const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req,res,next) => {
    res.end('we will send all promo information to you');
})
.post((req,res,next) => {
    res.end("will add the promo:" + req.body.name + " with details: "
             + req.body.description);
})
.put((req,res,next) => {
    res.statusCode = 403;
    res.end("PUT operation is not suported on /promo");
})
.delete((req,res,next) => {
    res.end('Deleting all promo!');
});


promoRouter.route('/:promoId')
.get((req,res,next) => {
    res.end('we will send details of promo ' + req.params.promoId + " to you.");
})
.post((req,res,next) => {
    res.statusCode = 403;
    res.end("POST operation is not suported on /promo/" + req.params.promoId);
})
.put((req,res,next) => {
    res.write("Updating the promo:" + req.params.promoId + "\n");
    res.end("will add the promo:" + req.body.name + " with details: "
            + req.body.description);
})
.delete((req,res,next) => {
    res.end('Deleting promo' + req.params.promoId);
});

module.exports = promoRouter;