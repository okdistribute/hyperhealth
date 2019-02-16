module.exports = function (archive) {
  if (!archive) return
  function get () {
    archive.metadata.update()
    if (!archive.content) return
    archive.content.update()

    var length = archive.content.length
    var peers = []

    for (var i = 0; i < archive.content.peers.length; i++) {
      var peer = archive.content.peers[i]
      var have = 0

      if (!peer.stream) continue

      for (var j = 0; j < length; j++) {
        if (peer.remoteBitfield && peer.remoteBitfield.get(j)) have++
      }

      if (!have) continue
      peers.push({ id: i, have: have, length: length })
    }


    return {
      byteLength: archive.content.byteLength,
      length: length,
      peers: peers
    }
  }

  return {
    get: get
  }
}
