const http = require('http');
const app = require('express')();
const gpio = require('rpi-gpio');
const ambient = require('./controllers/ambient')

const sensorPin = 4;    //#Pin to which ambient sensor is connected
const sensorType = 11;  //DHT-11

ambient.init(sensorType, sensorPin)

const outputPins = [40, 38, 36, 32, 26, 24, 22, 18];

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
      toggleLed();
      res.write('All outputs set to '+outPinValue);
      res.end();
   })

var server = app.listen(8888, function() {
   var host = server.address().address
   var port = server.address().port
   console.log('Listening at http://%s:%s', host, port);
})
