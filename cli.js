#!/usr/bin/env node
var Health = require('./')
var pretty = require('pretty-bytes')
var logger = require('status-logger')
var progress = require('progress-string')
var hyperdrive = require('hyperdrive')
var memdb = require('memdb')
var hyperdiscovery = require('hyperdiscovery')
var pick = require('lodash.pick')
var localcast = require('localcast')

var key = process.argv.slice(2)[0]
if (!key) {
  console.error('hyperhealth <link>')
  process.exit(1)
}

var cast = localcast('hyperhealth')
var drive = hyperdrive(memdb())
var archive = drive.createArchive(key, {sparse: true, live: true})
var swarm = hyperdiscovery(archive)

var health = Health(archive)

var output = ['Watching ' + key, 'Connecting...']
var peerOutput = []
var log = logger([output, peerOutput])
var bars = {}

setInterval(function () {
  getHealth()
  log.print()
}, 100  )
getHealth()
cast.on('localcast', function () {
  cast.emit('key', key)
})

function getHealth () {
  var data = health.get()
  if (!data || !data.peers.length) {
    output[1] = '\nNo peers.'
    bars = {}
    peerOutput.length = 0
    if (data && data.blocks) cast.emit('data', data)
    return
  }
  cast.emit('data', data)
  output[1] = 'Size: ' + pretty(data.bytes) + '\n'

  var connectedPeerIds = []

  for (var i = 0; i < data.peers.length; i++) {
    var peer = data.peers[i]
    var bar = bars[peer.id] ? bars[peer.id] : addPeerBar(peer.id, data.blocks)
    var msg = 'Peer ' + (i+1) + ': ' + bar(peer.have) + ' (' + peer.have + '/' + peer.blocks + ')'
    peerOutput[i] = msg
    connectedPeerIds.push(peer.id)
  }

  if (connectedPeerIds.length !== Object.keys(bars).length) {
    // remove the dropped peer bars
    bars = pick(bars, connectedPeerIds)
    peerOutput.pop()
  }
}

function addPeerBar (id, blocks) {
  bars[id] = progress({
    width: 50,
    total: blocks, // TODO: what if total size changes for existing bars
    style: function (complete, incomplete) {
      return '[' + complete + incomplete + ']'
    }
  })
  peerOutput.push()
  return bars[id]
}
