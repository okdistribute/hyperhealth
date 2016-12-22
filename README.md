# hyperhealth

Monitor the health of a hypercore, hyperdrive or dat, including peer count and
peer mirror percentages. Does not actually download any data content, only
downloads some of the metadata and monitors the peer feeds.

```
npm install hyperhealth
```

## Example

```js
var Health = require('hyperhealth')

var health = Health('ARCHIVE_KEY')

// Will fire every 1 second
setInterval(function () {
  var data = health.get()
  console.log(data.peers.length, 'total peers')
  console.log(data.bytes, 'total bytes')
  console.log(data.blocks, 'total blocks')
  console.log('Peer 1 Downloaded %' + data.peers[0].have / data.peers[0].blocks)
}, 1000)
```

## API

### `health = Health(key-or-core-or-archive, [opts])`

Takes a `hyperdrive` key or the corresponding hyperdrive archive instance.
Returns an object `health`.

* `opts` are passed to the `hyperdiscovery` instance

### `health.swarm`

The swarm instance.

### `health.archive`

The archive instance. 

### `health.feed`

The `hypercore` feed that's monitored.

### `health.get()`

When called will return an object representing the health at a particular
state.

Returns:

* ```bytes```: Number of total bytes
* ```blocks```: Number of total blocks
* ```peers```: An array of the peers containing `id`, `blocks`, and `have`

### Peer object

* `id`: The unique id of the peer, derived from `stream.remoteId`
* `have`: The number of blocks that have been downloaded
* `blocks`: The total number of blocks
