module.exports = function (feedOrArchive) {
  var feed = null

  feedOrArchive.open(function () {
    if (feedOrArchive.content) feed = feedOrArchive.content
    else feed = feedOrArchive
    feed.get(0, function (data) {
      // hack to get metadata info
    })
  })

  function get () {
    if (!feed || !feed.peers) return
    var peers = []

    for (var i = 0; i < feed.peers.length; i++) {
      var peer = feed.peers[i]
      if (!peer.stream.remoteId) return // TODO: why is this happening?
      peers.push({
        id: peer.stream.remoteId.toString('hex'),
        have: peer.remoteLength, // https://github.com/mafintosh/hypercore/tree/v4#feedpeers
        blocks: feed.blocks
      })
    }

    return {
      bytes: feed.bytes,
      blocks: feed.blocks,
      peers: peers
    }
  }

  return {
    get: get
  }
}
