
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-use-audio-player.cjs.production.min.js')
} else {
  module.exports = require('./react-use-audio-player.cjs.development.js')
}
