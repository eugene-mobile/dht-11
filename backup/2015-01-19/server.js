const http = require('http');
const app = require('express')();
const dht11 = require('node-dht-sensor');
const gpio = require('rpi-gpio');

const outputPins = [40, 38, 36, 32, 26, 24, 22, 18];

const sensorPin = 4;

var recentRead;
var outPinValue = false;

outputPins.forEach(function(pinNum) {
   gpio.setup(pinNum, gpio.DIR_OUT);
})

function toggleLed() {
   outPinValue = !outPinValue;
   outputPins.forEach(function(pinNum) {
      try {
         gpio.output(pinNum, outPinValue, function(err) {
           if (err) console.log('Error writing to pin: '+err);
           console.log(pinNum+' pin set to '+outPinValue);
         });
      } catch (err) {}
   })
}

var sensor = {
   initialize: function() {
      return dht11.initialize(11, sensorPin)
   }, 
   read: function() {
      recentRead = dht11.read()
      //console.log('Temp: '+recentRead.temperature + 'C; Humidity:  '+recentRead.humidity+'%')
      setTimeout(function() {
         sensor.read()
      }, 500);
   }
}

if (sensor.initialize()) {
   sensor.read()
} else {
   console.warn('Failed to initialize sensor');
}

app.get('/ajax/ambient', function(req, res) {
      console.log('HTTP GET request /ambient')
      if (!recentRead) {
         res.write('Not ready yet');
      } else {
         //res.write(JSON.stringify(recentRead));
         res.json(recentRead);
      }
      res.end()
   })

app.get('/ajax/pin/*', function(req, res) {
      console.log('HTTP post to '+req.url);
      toggleLed();
      res.write('All outputs set to '+outPinValue);
      res.end();
   })

var server = app.listen(8888, function() {
   var host = server.address().address
   var port = server.address().port
   console.log('Listening at http://%s:%s', host, port);
})
