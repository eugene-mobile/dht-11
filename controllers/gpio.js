const rpi = require('rpi-gpio');

exports.init = function init(outputPins) {
    if (outputPins instanceof Array) {
        outputPins.forEach(function(pinNum) {
            rpi.setup(pinNum, rpi.DIR_OUT);
        })
    } else {
        rpi.setup(outputPins, rpi.DIR_OUT);
    }
}

exports.setPinValue = function(pinNumber, value) {
    if (pinNumber instanceof Array) {
        pinNumber.forEach(function(pinNum) {
            try {
                pins.output(pinNum, value, function(err) {
                    if (err) console.log('Error writing to pin: '+err);
                    console.log(pinNum+' pin set to '+outPinValue);
                });
            } catch (err) {}
        })
    } else {
        try {
            pins.output(pinNumber, value, function(err) {
                if (err) console.log('Error writing to pin: '+err);
                console.log(pinNum+' pin set to '+outPinValue);
            });
        } catch (err) {}
    }

}

