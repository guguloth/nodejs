const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port =3000;

const server = http.createServer((req,res) => {
    console.log("Request for "+ req.url+ " by method "+req.method);

    if(req.method == 'GET'){
        var fileUrl;
        if(req.url == '/')
            fileUrl = '/index.html';
        else 
            fileUrl = req.url; 
        
            console.log("fileUrlllll "+ fileUrl);
        var filePath = path.resolve('public'+fileUrl);
        console.log("filepath "+filePath);
        const fileExt = path.extname(filePath);
        console.log("fileExtention "+fileExt);
        if(fileExt == '.html'){
            fs.exists(filePath,(exists) =>{
                console.log(filePath);
                if(!exists){
                    console.log("not found");
                    res.statusCode = 404;
                    res.setHeader('content-Type','text/html');
                    res.end("<html><body><h1>Error: 404 "+fileUrl + " not found</h1></body></html>");
                    return
                }
                res.statusCode = 200;
                res.setHeader('content-Type','text/html');
                fs.createReadStream(filePath).pipe(res);
            })
        }else{
            res.statusCode = 404;
            res.setHeader('content-Type','text/html');
            res.end("<html><body><h1>Error: "+fileUrl + " not an html file</h1></body></html>");
            return;         
        }
    }else{
        res.statusCode = 404;
            res.setHeader('content-Type','text/html');
            res.end("<html><body><h1>Error: "+req.method + " not supported</h1></body></html>");
            return;   
    }
})

server.listen(port,hostname, () => {
    console.log(`server running at http://${hostname}:${port}`)
})