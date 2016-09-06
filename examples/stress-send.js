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

// NOTE: must create the datachannel before the offer
const dc = pc.createDataChannel('test');
dc.onopen = () => {
  console.log('data channel open');
  for (let i = 0; i < 1024 * MB; i++) {
    const ab = new ArrayBuffer(1500);
    dc.send(ab);
  }
  console.log('all sent!');
  pc.close();
};

pc.createOffer((offer) => {
  console.log(JSON.stringify(offer));
  pc.setLocalDescription(offer);
}, console.error);

setTimeout(function() {
  console.log("\nPlease enter receivers answer and ice candidates: ");
}, 2000);
var count = 0;
reader.on('line', function(line) {
  if (count < 1) {
    pc.setRemoteDescription(JSON.parse(line));
  } else {
    pc.addIceCandidate(JSON.parse(line).candidate);
  }
  count++;
});
