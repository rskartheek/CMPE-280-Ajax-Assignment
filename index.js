/**
 * Created by SaiKartheek on 3/23/2016.
 */

var express = require('express');
var mongoose = require('mongoose');
var  cors = require('cors');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/registration';

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var port = 3000;

app.use(express.static('public'));
app.use( bodyParser.json());
app.set('views','src/views');
app.engine('html', require('ejs').renderFile);




app.get('/',function(request,response){
    response.render('RegistrationPage.html');
});

app.get('/RandomCheck',function(request,response){
    response.status(200).send({"status":1});
});

app.post('/RegisterUser',function(request,response){
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db,request.body, function(result) {
            db.close();
            response.status(200).send(result);
        },function(){
            db.close();
            response.status(500).send({"error":"Error in saving"});
        });
    });
});

var insertDocument = function(db,data,callback){
    db.collection('users').insertOne(data,function(err,result){
        assert.equal(err, null);
        console.log("Inserted a document into the users collection.");
        callback(result);
    });
};




app.listen(port, function(err){
    console.log('Running server on port: ' +port);
});

