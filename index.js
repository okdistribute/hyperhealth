const memdb = require('memdb')
const hyperdrive = require('hyperdrive')
const discovery = require('hyperdiscovery')

module.exports = function (archiveOrKey, opts) {
  var archive = archiveOrKey.key ? archiveOrKey : createArchive(archiveOrKey)
  var feed = (archive.content) ? archive.content : archive
  var swarm = discovery(archive, opts)

  archive.open(function () {
    feed.get(0, function () {
      // hack to get data
    })
  })

  function get () {
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
      peers.push({id: peer.stream.remoteId.toString('hex'), have: have, blocks: feed.blocks})
    }

    return {
      connected: swarm.connected,
      bytes: feed.bytes,
      blocks: feed.blocks,
      peers: peers
    }
  }

  return {
    get: get,
    feed: feed,
    swarm: swarm,
    archive: archive
  }
}

function createArchive (key) {
  var drive = hyperdrive(memdb())
  var archive = drive.createArchive(key, { sparse: true, live: true })
  return archive
}
