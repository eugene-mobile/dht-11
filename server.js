const http = require('http');
const app = require('express')();

const ambient = require('./controllers/ambient')
const gpio = require('./controllers/gpio')

const sensorPin = 4;    //#Pin to which ambient sensor is connected
const sensorType = 11;  //DHT-11

ambient.init(sensorType, sensorPin)

const outputPins = [40, 38, 36, 32, 26, 24, 22, 18];
var pinValue = false;

gpio.init(outputPins)

app.get('/ajax/ambient', function(req, res) {
      console.log('HTTP GET request /ambient')
      var reading = ambient.recentRead();
      if (!reading) {
         res.write('Not ready yet');
      } else {
         //res.write(JSON.stringify(recentRead));
         res.json(reading);
      }
      res.end()
   })

app.post('/ajax/pin/*', function(req, res) {
    console.log('HTTP post to '+req.url);
    pinValue = !pinValue;
    gpio.togglePin(40, pinValue)
    res.write('Pin 40 set to '+pinValue);
    res.end();
   })

var server = app.listen(8888, function() {
   var host = server.address().address
   var port = server.address().port
   console.log('Listening at http://%s:%s', host, port);
})
