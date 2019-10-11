'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  dev: {
    //host: '192.168.1.107'
  },
  NODE_ENV: '"development"'
})
