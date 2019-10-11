'use strict'
const merge = require('webpack-merge')
const env = require('./index')

module.exports = merge(env, {
  dev: {
    //host: '192.168.1.107'
  },
  NODE_ENV: '"development"',
  IS_WEB: 'true'

})
