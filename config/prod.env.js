'use strict'
const merge = require('webpack-merge')
const gestib2GoogleEnv = require('./gestib2google.env')

module.exports = merge(gestib2GoogleEnv, {
  NODE_ENV: '"production"'
})
