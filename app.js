
/**
 * MIDI
 **/
 
var midi = require('midi');
var midiOut = new midi.output();

// open midi port
try {
  console.log('Opening midi port.');
  midiOut.openPort(0);
} catch(error) {
  midiOut.openVirtualPort('');
}

// close midi port on termination
process.on("SIGTERM", function(){
  midiOut.closePort();
});

/*
// Set up a new input.
var midiIn = new midi.input();

// Count the available input ports.
console.log(midiIn.getPortCount());

// Get the name of a specified input port.
console.log(midiIn.getPortName(0));

// Configure a callback.
midiIn.on('message', function(deltaTime, message) {
  console.log('m:' + message + ' d:' + deltaTime);
});

// Open the first available input port.
midiIn.openPort(0);
*/

/**
 * PubNub
 **/
 
var pubnub = require('pubnub').init({
    publish_key: "pub-c-a7fcdbd9-359e-4df7-b71a-6e227656f161",
    subscribe_key: "sub-c-4ac38ffa-fc09-11e2-b598-02ee2ddab7fe",
    secret_key: "sec-c-NzI4ZjQ1MmMtYjZlNC00MmE3LThkYmYtNzRlNmZlNzU4ZWVi",
    ssl: false,
    origin: "pubsub.pubnub.com"
});

var controlIds = [44, 45, 46, 47, 48, 49, 50, 51, 32, 33, 34, 35, 36, 37, 38, 39];

pubnub.subscribe({
    channel: "mass_channel",
    connect: function() {
        console.log('Pubnub: Connected.');
        pubnub.publish({
            channel: 'mass-channel',
            message: { text : 'Server ready to receive.' }
        });
    },
    callback: function(msg) {
        console.log(msg);
        
        if(msg.type == 'ATTEND'){
          console.log(controlIdQueue);
          midiOut.sendMessage([144, controlIds.shift(), 100]);
        }
        
        if(msg.type == 'RESET'){
          var controlIds = [44, 45, 46, 47, 48, 49, 50, 51, 32, 33, 34, 35, 36, 37, 38, 39];
        }
        
        if(msg.type == 'MIDI'){
          midiOut.sendMessage(msg.data);
        }
    },
    error: function() {
        console.log("Pubnub: Network connection dropped.");
    }
});