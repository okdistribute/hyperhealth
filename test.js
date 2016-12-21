var health = require('./')
var test = require('tape')

test('a test', function (t) {
  var key = '587db7de5a030b9b91ddcb1882cf0e4b67b4609568997eee0d4dfe74ce31d198'
  var emitter = health(key)

  emitter.on('change', function (err, data) {
    t.ifError(err)
    console.log(data)
  })
})
