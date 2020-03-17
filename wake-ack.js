var fileConnection = require('formidable');
var events = require('events');
var connectionEventEmitter = new events.EventEmitter();

//Create an event handler:
var eventHandler = function(){
    console.log('squawk detected.');
}


connectionEventEmitter.on('squawk', eventHandler)

connectionEventEmitter('squawk');