const memdb = require('memdb')
const EventEmitter = require('events').EventEmitter
const hyperdrive = require('hyperdrive')
const discovery = require('hyperdiscovery')

module.exports = function (archiveOrKey, opts) {
  if (!opts) opts = {}
  var archive = archiveOrKey.metadata ? archiveOrKey : createArchive(archiveOrKey)
  var swarm = discovery(archive)
  var emitter = new EventEmitter()
  archive.open(function () {
    archive.content.get(0, function () {
      // hack to get data
    })
  })

  function change (data) {
    emitter.emit('change', data)
  }

  setInterval(begin, opts.interval || 1000)

  function begin () {
    var feed = archive.content
    if (!archive.content) return
    var blocks = feed.blocks
    var peers = []

    for (var i = 0; i < feed.peers.length; i++) {
      var have = 0
      var peer = feed.peers[i]

      if (!peer.stream || !peer.stream.remoteId) continue

      for (var j = 0; j < blocks; j++) {
        if (peer.remoteBitfield.get(j)) have++
      }

      if (!have) continue
      peers.push({id: peer.stream.remoteId, have: have, blocks: feed.blocks})
    }

    change({
      connected: swarm.connected,
      bytes: archive.content.bytes,
      blocks: archive.content.blocks,
      peers: peers
    })
  }

  return emitter
}


function createArchive (key) {
  var drive = hyperdrive(memdb())
  var archive = drive.createArchive(key, { sparse: true, live: true })
  return archive
}
