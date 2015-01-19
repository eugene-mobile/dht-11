const dht11 = require('node-dht-sensor');

var recentRead;

function init(sensorType, pinNumber) {
    var result = dht11.initialize(sensorType, pinNumber)
    if (result) {
        read();
    } else {
        console.warn('Failed to initialize DHT-'+sensorType+' sensor on GPIO#'+pinNumber);
    }
    return result;
}

function read() {
    recentRead = dht11.read()
    //console.log('Temp: '+recentRead.temperature + 'C; Humidity:  '+recentRead.humidity+'%')
    setTimeout(function() {
        read()
    }, 500);
}

exports.init = init
exports.recentRead = function () {
    return recentRead;
}