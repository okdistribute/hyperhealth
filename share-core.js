var hypercore = require('hypercore')
var hyperhealth = require('hyperhealth')
var hyperdiscovery = require('hyperdiscovery')
var ram = require('random-access-memory')

var core = hypercore(ram, {valueEncoding: 'json'})
core.on('ready', () => {
  var swarm = hyperdiscovery(core)
  var key = core.key.toString('hex')
  console.log(key)
  core.append({'hello': 'world'}, function () {
    core.append({'hello': 'verden'}, function () {
    })
  })
})

function loop (feed) {
  var health = hyperhealth(feed)
  setInterval(function () {
    var h = health.get()
    console.log(h)
  }, 1000)
}
