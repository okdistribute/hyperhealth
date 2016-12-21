const memdb = require('memdb')
const EventEmitter = require('events').EventEmitter
const hyperdrive = require('hyperdrive')
const discovery = require('hyperdiscovery')

module.exports = function (archiveOrKey) {
  var archive = archiveOrKey.metadata ? archiveOrKey : createArchive(archiveOrKey)
  var swarm = discovery(archive)
  var emitter = new EventEmitter()

  archive.open(function () {
    change()
  })
  swarm.on('connection', function (conn) {
    change()
    conn.on('close', change)
  })
  swarm.on('error', function (err) {
    emitter.emit('error', err)
  })

  function change () {
    emitter.emit('change', {peers: swarm.connections.length})
  }

  return emitter
}


function createArchive (key) {
  var drive = hyperdrive(memdb())
  return drive.createArchive(key, { sparse: true, live: true})
}
