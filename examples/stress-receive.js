'use strict';

const readline = require('readline');
const webrtc = require('.././');

const MB = 32;

const pc = new webrtc.RTCPeerConnection();
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

pc.onicecandidate = (candidate) => {
  console.log(JSON.stringify(candidate));
};

pc.ondatachannel = (event) => {
  console.log('data channel open');
  const dc = event.channel;
  let r = 0;
  dc.onmessage = (event) => {
    r++;
    if (r >= 1024 * MB) {
      console.log('all received!');
      pc.close();
    }
  };
};

setTimeout(function() {
  console.log("\nPlease enter senders offer and ice candidates: ");
}, 2000);
var count = 0;
reader.on('line', function(line){
  if (count < 1) {
    pc.setRemoteDescription(JSON.parse(line));
    pc.createAnswer((answer) => {
      console.log(JSON.stringify(answer));
      pc.setLocalDescription(answer);
    }, console.error);
  } else {    
    pc.addIceCandidate(JSON.parse(line).candidate);
  }
  count++;
});
