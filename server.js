var express = require('express');
var cors = require('cors');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
const dataPath = 'ideas.json';

app.use(cors());
app.use(bodyParser.json());

app.get('/ideas', function (req, res) {
    fs.readFile(dataPath, function (err, data) {
        res.end(data);
    });
});

app.get('/ideas/new', function (req, res) {
    fs.readFile(dataPath, function (err, data) {
        data = JSON.parse(data);
        var maxKey = Math.max.apply(0, data.map(function(elt) { return elt.id; }));
        var newId = maxKey + 1;
        var date = new Date();
        var ideaNew = {
            'id': newId,
            'created_date': date
        };
        res.end(JSON.stringify(ideaNew));
    });
});

app.post('/idea/update', function (req, res) {
    var writeData = fs.readFileSync(dataPath, 'utf8');
    var changes = req.body;
    var updateData = JSON.parse(writeData);
    if (changes.created_date) {
        updateData.push(changes);
        changedObject = changes;
    } else {
        for (var i = 0; i < updateData.length; i++) {
            if (updateData[i].id === changes.id) {
                if (changes.body) {
                    updateData[i].body = changes.body
                } else if (changes.title) {
                    updateData[i].title = changes.title
                }
                changedObject = updateData[i];
            }
        }
    }
    changedObject = JSON.stringify(changedObject);
    updateData = JSON.stringify(updateData);
    fs.writeFileSync(dataPath, updateData, 'utf8');
    res.end(changedObject);
});

app.post('/idea/delete', function (req, res) { 
    var writeData = fs.readFileSync(dataPath, 'utf8');
    var changes = req.body;
    var updateData = JSON.parse(writeData);
    for (var i = 0; i < updateData.length; i++) {
        if (updateData[i].id === changes.id) {
            changedObject = changes.id;
            updateData.splice(i, 1);
        }
    }
    updateData = JSON.stringify(updateData);
    changedObject = JSON.stringify(changedObject);
    fs.writeFileSync(dataPath, updateData, 'utf8');
    res.end(changedObject);
});

app.listen(3000);