module.exports = function (feed) {
  if (feed.content) feed = feed.content

  function get () {
    if (!feed || !feed.peers) return
    feed.update()
    var length = feed.length
    var peers = []

    for (var i = 0; i < feed.peers.length; i++) {
      var have = 0
      var peer = feed.peers[i]

      if (!peer.stream || !peer.stream.remoteId) continue

      for (var j = 0; j < length; j++) {
        if (peer.remoteBitfield && peer.remoteBitfield.get(j)) have++
      }

      if (!have) continue
      peers.push({id: i, have: have, length: feed.length})
    }

    return {
      byteLength: feed.byteLength,
      length: feed.length,
      peers: peers
    }
  }

  return {
    get: get
  }
}

function noop () { }
