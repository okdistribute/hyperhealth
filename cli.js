#!/usr/bin/env node
var Health = require('./')
var pretty = require('pretty-bytes')
var logger = require('status-logger')
var progress = require('progress-string')
var hyperdrive = require('hyperdrive')
var ram = require('random-access-memory')
var pick = require('lodash.pick')
var datLink = require('dat-link-resolve')
var discovery = require('hyperdiscovery')

var key = process.argv.slice(2)[0]
if (!key) {
  console.error('hyperhealth <link>')
  process.exit(1)
}

var output = ['Watching ' + key, 'Connecting...']
var peerOutput = []
var log = logger([output, peerOutput])
var bars = {}
var health = null

datLink(key, function (err, key) {
  if (err) throw err
  var archive = hyperdrive(ram, key, { sparse: true })
  health = Health(archive)

  archive.on('ready', () => {
    discovery(archive)
    archive.metadata.get(0, () => {
      setInterval(function () {
        getHealth()
        log.print()
      }, 100)
    })
  })
})

function getHealth () {
  // if (!health) return
  var data = health.get()
  if (!data || !data.peers.length) {
    output[1] = '\nNo peers.'
    bars = {}
    peerOutput.length = 0
    return
  }
  output[1] = 'Size: ' + pretty(data.byteLength) + '\n'

  var connectedPeerIds = []

  for (var i = 0; i < data.peers.length; i++) {
    var peer = data.peers[i]
    var bar = bars[peer.id] ? bars[peer.id] : addPeerBar(peer.id, data.length)
    var msg = 'Peer ' + (i + 1) + ': ' + bar(peer.have) + ' (' + peer.have + '/' + peer.length + ')'
    peerOutput[i] = msg
    connectedPeerIds.push(peer.id)
  }

  if (connectedPeerIds.length !== Object.keys(bars).length) {
    // remove the dropped peer bars
    bars = pick(bars, connectedPeerIds)
    peerOutput.pop()
  }
}

function addPeerBar (id, length) {
  bars[id] = progress({
    width: 50,
    total: length, // TODO: what if total size changes for existing bars
    style: function (complete, incomplete) {
      return '[' + complete + incomplete + ']'
    }
  })
  peerOutput.push()
  return bars[id]
}
