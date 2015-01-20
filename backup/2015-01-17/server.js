const dht11 = require('node-dht-sensor');
const gpio = require('rpi-gpio');

var outPinValue = true;

const outputPins = [40, 38, 36, 32, 26, 24, 22, 18];

outputPins.forEach(function(pinNum) {
   gpio.setup(pinNum, gpio.DIR_OUT);
})

function toggleLed() {
   outPinValue = !outPinValue;
   outputPins.forEach(function(pinNum) {
      outPinValue = !outPinValue;
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
      return dht11.initialize(11, 4)
   }, 
   read: function() {
      var readout = dht11.read()
      console.log('Temp: '+readout.temperature + 'C; Humidity:  '+readout.humidity+'%')
      toggleLed();
      setTimeout(function() {
         sensor.read()
      }, 2000);
   }
}

if (sensor.initialize()) {
   sensor.read()
} else {
   console.warn('Failed to initialize sensor');
}

