#!/usr/bin/env node
const Health = require('./')
const pretty = require('pretty-bytes')

var key = process.argv.slice(2)[0]
if (!key) {
  console.error('dat-health <link>')
  process.exit(1)
}
console.log('Watching', key)
var health = Health(key)
setInterval(function () {
  var data = health.get()
  console.log('Size: ' + pretty(data.bytes))
  for (var i = 0; i < data.peers.length; i++) {
    var peer = data.peers[i]
    console.log('Peer ' + (i+1) + ': ' + peer.have + '/' + peer.blocks)
  }
  if (!data.peers.length) console.log('No peers.')
}, 2000)
