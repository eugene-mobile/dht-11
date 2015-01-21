const rpi = require('rpi-gpio');

var pinValues = new Array(40);

rpi.on('change', function(channel, value) {
    if (value===undefined) {
        return;
    }
    console.log('Channel ' + channel + ' value is now ' + value);
    pinValues[channel-1] = value;
    console.log(pinValues);
});

exports.init = function init(outputPins) {
    if (outputPins instanceof Array) {
        outputPins.forEach(function(pinNum) {
            rpi.setup(pinNum, rpi.DIR_OUT);
            pinValues[pinNum-1] = false;
        })
    } else {
        rpi.setup(outputPins, rpi.DIR_OUT);
        pinValues[pinNum-1] = false;
    }
}

exports.readPinValue = function(pinNumber) {
    return pinValues[pinNumber];
}

exports.allPinValues = function() {
    console.log("All pin values: "+pinValues);
    var result = [];
    for (var idx = 0; idx<40; idx++) {
        var val = pinValues[idx];
        if (val===undefined) {
            continue;
        }
        result.push({
            pinNum: idx+1,
            pinValue: pinValues[idx]
        });
    }
    return result;
}

exports.setPinValue = function(pinNumber, value) {
    if (pinNumber instanceof Array) {
        pinNumber.forEach(function(pinNum) {
            try {
                console.log("Setting "+pinNum+" to "+value);
                rpi.output(pinNum, value, function(err) {
                    if (err) console.log('Error writing to pin: '+err);
                    console.log(pinNum+' pin set to '+value);
                    pinValues[pinNum-1] = value;
                });
            } catch (err) {
                console.log(err);
            }
        })
    } else {
        try {
            console.log("Setting "+pinNumber+" to "+value);
            rpi.output(pinNumber, value, function(err) {
                if (err) console.log('Error writing to pin: '+err);
                console.log(pinNumber+' pin set to '+value);
                pinValues[pinNumber-1] = value;
            });
        } catch (err) {
            console.log(err);
        }
    }

}

