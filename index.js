module.exports = function (core) {
  if (!core) throw new Error('Core required. Got null')
  function get () {
    var feed

    if (core.content) {
      feed = core.content
      core.metadata.update()
      core.content.update()
    } else {
      feed = core
      core.update()
    }

    var length = feed.length
    var peers = []

    for (var i = 0; i < feed.peers.length; i++) {
      var peer = feed.peers[i]
      var have = 0

      if (!peer.stream) continue

      for (var j = 0; j < length; j++) {
        if (peer.remoteBitfield && peer.remoteBitfield.get(j)) have++
      }

      peers.push({ id: i, have: have, length: length })
    }

    return {
      byteLength: feed.byteLength,
      length: length,
      peers: peers
    }
  }

  return {
    get: get
  }
}
