const express = require('express');
const os = require('os');
var cron = require('node-cron');
const path = require("path");
const app = express();

var fs = require('fs');
var pathToJsonfile = 'opendata.json';
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://13.48.25.116:27017/";

// retrieve all data from mongodb and update cache file (opendata.json)
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("efimongo");
    dbo.collection("opendata").find({}, { projection: { _id: 0 } }).toArray(function(err, result) {
        if (err) throw err;
        // write result back to file cache(opendata.json)
        console.log(result);

        fs.writeFile("./opendata.json", JSON.stringify(result), 'utf8', function(err){
        if (err) {
            console.log(err);
            throw err;
        }
        console.log("The file is saved.");
    });
        db.close();
    });
    });

    cron.schedule('1 * * * *', () => {
        console.log('running a task every hour');
        console.log("schduler is on");
    
        var filename = 'opendata.json';
        fs.open(filename,'r',function(err, fd){
            if (err) {
              fs.writeFile(filename, '[]', function(err) {
                  if(err) {
                      console.log(err);
                  }
                  console.log("Create new opendata.json file!");
              });
            } else {
              console.log("The file exists!");
            }
          });
    
        // retrieve all data from mongodb and update cache file (opendata.json)
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("efimongo");
            dbo.collection("opendata").find({}, { projection: { _id: 0 } }).toArray(function(err, result) {
                if (err) throw err;
                // write result back to file cache(opendata.json)
                console.log(result);

                fs.writeFile("./opendata.json", JSON.stringify(result), 'utf8', function(err){
                if (err) {
                    console.log(err);
                    throw err;
                }
                console.log("The file is saved.");
            });
                db.close();
            });
            });
      });

app.use(express.static('dist'));
app.get('/api/getUptime', (req, res) => res.send({ uptime : os.uptime() }));
app.get('/api/updateData', (req, res) => {
    var absolutePath = path.resolve(__dirname, pathToJsonfile);
    fs.readFile(absolutePath, 'utf8', function(err,obj){
        var response = JSON.parse(obj);
        //seprate 4 sensor data into 4 arrays
        const allSensors = [];

        for (let j = 1; j < Object.keys(response[0]).length; j += 1) {
            const sensor = [];
            for (let i = 0; i < response.length; i += 1) {
            const name = Object.keys(response[0])[j];
            sensor.push([response[i].date, response[i][name]]);
            }
            allSensors.push(sensor);
        }

        res.send(allSensors);
        if (err){
            console.log(err);
            throw err;
        }
    });
});

app.listen(process.env.PORT || 5000, () => console.log(`Listening on port ${process.env.PORT || 5000}!`));
