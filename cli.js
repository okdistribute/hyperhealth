#!/usr/bin/env node
var Health = require('./')
var debug =  require('debug')('hyperhealth')
var pretty = require('pretty-bytes')
var logger = require('status-logger')
var progress = require('progress-string')
var hypercore = require('hypercore')
var hyperdrive = require('hyperdrive')
var ram = require('random-access-memory')
var pick = require('lodash.pick')
var datLink = require('dat-link-resolve')
var discovery = require('hyperdiscovery')
var messages = require('hyperdrive/lib/messages')

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
debug('key', key)

datLink(key, function (err, key) {
  if (err) throw err
  var metadata = hypercore(ram, key, { sparse: true })
  debug('getting key', key)
  metadata.on('ready', () => {
    var swarm = discovery(metadata)
    getHyperdriveKey(metadata, function (_key) {
      debug('get', key)
      swarm.destroy()
      var core = key ? hyperdrive(ram, key, { metadata, sparse: true }) : metadata
      core.on('ready', () => {
        health = Health(core)
        debug(core)
        discovery(core)
        setInterval(function () {
          getHealth()
          log.print()
        }, 100)
      })
    })
  })
})

function getHyperdriveKey (core, cb) {
  debug('get')
  if (core.length) return get()
  debug('update')
  core.update(get)

  function get () {
    debug('getting')
    core.get(0, {valueEncoding: messages.Index}, async (err, index) => {
      debug('got', err, index)
      if (err) return cb()
      if (index && index.type === 'hyperdrive') {
        debug(index.content)
        return cb(index.content.toString('hex'))
      }
      debug('calling back')
      return cb()
    })
  }
}

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
