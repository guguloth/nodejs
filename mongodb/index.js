const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');
const dbupper=require('./operations');
const url='mongodb://localhost:27017/';
const dbname='confusion';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
    
}

MongoClient.connect(url,options).then((client,err)=>{
    assert.equal(err,null);

    const db =client.db(dbname);
    console.log('Connected correctly to the server');

    dbupper.insertDocument(db,{name:'ansh',description:'text'},'dishes')
    .then((result)=>{
        console.log("Insert Document:\n",result);
        return dbupper.findDocuments(db,'dishes');
    })
    .then((docs)=>{
        console.log('Found Documents:\n',docs);

        return dbupper.updateDocument(db,{name:'ansh'},{description:'updates text'},'dishes');
    })
    .then((result)=>{
        console.log('Updated Documents:\n',result.acknowledged);

        return dbupper.findDocuments(db,'dishes');
    })
    .then((docs)=>{
        console.log('Found Documents:\n',docs);

        return db.dropCollection('dishes')
    })
    .then((result)=>{
        console.log('Droped Collection: ',result);
        client.close();
    })
    .catch((err)=> console.log(err));
})               
.catch((err)=> console.log(err));