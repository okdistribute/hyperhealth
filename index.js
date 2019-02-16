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
      if (!peer.stream) continue
      peers.push({ id: i, have: peer.remoteLength, length: length })
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
