# hyperhealth

Monitor the health of a hyperdrive or dat, including peer count and peer mirror percentages.

```
npm install dat-health
```

## Example

```js
var Health = require('hyperhealth')

var health = Health('ARCHIVE_KEY')

// Will fire every 1 second
setInterval(function () {
  var data = health()
  console.log(data.peers.length, 'total peers')
  console.log(data.bytes, 'total bytes')
  console.log(data.blocks, 'total blocks')
  console.log('Peer 1 Downloaded %' + data.peers[0].have / data.peers[0].blocks)
}, 1000)
```

## API

```health = Health(key-or-archive)```

Takes a `hyperdrive` key or the corresponding hyperdrive archive instance. Returns a
function `health` that when called will return an object representing

Returns:

* ```bytes```: Number of total bytes
* ```blocks```: Number of total blocks
* ```peers```: An array of the peers containing `id`, `blocks`, and `have`

### Peer object

* `id`: The unique id of the peer, derived from `stream.remoteId`
* `have`: The number of blocks that have been downloaded
* `blocks`: The total number of blocks
