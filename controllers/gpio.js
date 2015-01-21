const rpi = require('rpi-gpio');

exports.init = function init(outputPins) {
    outputPins.forEach(function(pinNum) {
        rpi.setup(pinNum, rpi.DIR_OUT);
    })
}

exports.togglePin = function togglePin(pinNumber, value) {
    pinNumber.forEach(function(pinNum) {
        try {
            pins.output(pinNum, value, function(err) {
                if (err) console.log('Error writing to pin: '+err);
                console.log(pinNum+' pin set to '+outPinValue);
            });
        } catch (err) {}
    })
}

