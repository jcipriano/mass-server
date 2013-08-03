
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

// midiOut.sendMessage([144, data.message, 100]);

// close midi port on termination
process.on("SIGTERM", function(){
  midiOut.closePort();
});


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

pubnub.subscribe({
    channel: "mass_channel",
    connect: function() {
        console.log('Pubnub: Connected.');
        /*
        pubnub.publish({
            channel: 'mass-channel',
            message: { text : 'Ready to Receive.' }
        });
        */
    },
    callback: function(msg) {
        console.log(msg);
    },
    error: function() {
        console.log("Pubnub: Network connection dropped.");
    }
});