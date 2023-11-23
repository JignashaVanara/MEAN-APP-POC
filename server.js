var express = require('express');
var app = express();
var mongojs = require('mongojs');
var bodyParser = require('body-parser')
var db = mongojs("mongodb://localhost:27017/contactlist", ["contactlist"]);

app.use(express.static(__dirname+"/public"))
app.use(bodyParser.json())

const runSchemaValidation = function(){ 
    return db.runCommand( {
        collMod: "contactlist",
        validator: { $jsonSchema: {
            bsonType: "object",
            required: [ "name", "email"],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                email: {
                    bsonType: "string",
                    pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$",
                    description: "must be a string and is required"
                }
            }
        } },
        validationLevel: "strict"
    } );
}
app.get('/contactlist', function(req, res){
    runSchemaValidation();
    db.contactlist.find(function(err, docs){
        res.json(docs)
    })
});

app.get('/contactlist/:id', function(req, res){
    const id = req.params.id;
    runSchemaValidation();
    const query = { _id: mongojs.ObjectId(id) };
    db.contactlist.findOne(query, function(err, doc){
        res.json(doc);
    })
});

app.post('/contactlist', function(req, res){
    runSchemaValidation();
    db.contactlist.insert(req.body, function(err, docs){
        res.json(docs)
    })
})

app.put('/contactlist/:id', function(req, res){
    var id = req.params.id;
    runSchemaValidation();
    console.log(id)
    console.log(req.body)
    const query = { _id: mongojs.ObjectId(id) };
    const data = {name:req.body.name, email:req.body.email, number:req.body.number}
    db.contactlist.findAndModify({query:query,update: {$set: data}}, function(err, doc){
            res.json(doc);
            console.log(err)
        })
})

app.delete('/contactlist/:id', function(req, res){
    const id = req.params.id;
    const query = { _id: mongojs.ObjectId(id) };
    db.contactlist.remove(query, function(err, docs){
        res.json(docs)
        console.log(err)
    })
});

app.listen(3000);
console.log("Server running at PORT:3000")