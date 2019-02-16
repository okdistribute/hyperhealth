# hyperhealth

Monitor the health of a hyperfeed (hypercore or hyperdrive), including peer count and peer mirror percentages. 

Does not actually download any data content, only downloads some of the metadata and monitors the peer feeds.

```
npm install hyperhealth
```

## Example

```js
var Health = require('hyperhealth')

var health = Health(hyperdrive)

// Will fire every 1 second
setInterval(function () {
  var data = health.get()
  console.log(data.peers.length, 'total peers')
  console.log(data.length, 'total length')
  console.log(data.byteLength, 'total bytes')
  console.log('Peer 1 Downloaded ' + (data.peers[0].have / data.peers[0].length) * 100 + '%')
}, 1000)
```

## API

### `health = Health(archive-key, [opts])`

Takes a `hyperdrive` instance. Returns an object `health`.

### `health.get()`

When called will return an object representing the health at a particular
state.

Returns:

* ```byteLength```: Number of total bytes
* ```length```: Number of total blocks
* ```peers```: An array of the peers containing `id`, `length`, and `have`

### Peer object

* `id`: The unique id of the peer, derived from `stream.remoteId`
* `have`: The number of blocks that have been downloaded by peer
* `length`: The total number of blocks
