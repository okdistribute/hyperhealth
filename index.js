const memdb = require('memdb')
const hyperdrive = require('hyperdrive')
const discovery = require('hyperdiscovery')

module.exports = function (archiveOrKey, opts) {
  var archive = archiveOrKey.key ? archiveOrKey : createArchive(archiveOrKey)
  var swarm = discovery(archive, opts)
  archive.open(function () {
    archive.content.get(0, function () {
      // hack to get data
    })
  })

  function get () {
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

    return {
      connected: swarm.connected,
      bytes: archive.content.bytes,
      blocks: archive.content.blocks,
      peers: peers,
    }
  }

  return {
    get: get,
    swarm: swarm,
    archive: archive
  }
}


function createArchive (key) {
  var drive = hyperdrive(memdb())
  var archive = drive.createArchive(key, { sparse: true, live: true })
  return archive
}
