const http = require('http');
const app = require('express')();
const gpio = require('./controllers/gpio');
const ambient = require('./controllers/ambient')
var url = require("url");

const sensorPin = 4;    //#Pin to which ambient sensor is connected
const sensorType = 11;  //DHT-11

ambient.init(sensorType, sensorPin)

const outputPins = [40, 38, 36, 32, 26, 24, 22, 18];
gpio.useAsOutput(outputPins)

app.get('/ajax/ambient', function(req, res) {
    //console.log('HTTP GET request /ambient')
    var reading = ambient.recentRead();
    if (!reading) {
        res.write('Not ready yet');
    } else {
        res.json(reading);
    }
    res.end()
})

app.get('/ajax/pin', function(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var pathname = parsedUrl.pathname;
    console.log('GET request to '+pathname);
    var reading = gpio.allPinValues();
    res.json(reading);
    res.end();
})

app.post('/ajax/pin/*', function(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var pathname = parsedUrl.pathname;
    var query = parsedUrl.query;
    var pinNumberMatches = pathname.match(/\d+$/);
    var pinNum;
    if (pinNumberMatches) {
        pinNum = parseInt(pinNumberMatches[0]);
    }
    var value = query.value;
    if (pinNum===undefined || value===undefined) {
        console.log("Not all parameters have been defined in path "+pathname+" with query "+query);
        res.write('Please define "value"');
    } else {
        console.log("Request for " + pinNum + " received with parameter: " + value);
        gpio.setPinValue(pinNum, value);
        res.write('Pin ' + pinNum + ' set to ' + value);
    }
    res.end();
})

var server = app.listen(8888, function() {
   var host = server.address().address
   var port = server.address().port
   console.log('Listening at http://%s:%s', host, port);
})
