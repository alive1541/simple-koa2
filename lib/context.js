'use strict'
const delegate = require('delegates');

const proto = module.exports = {

}

delegate(proto, 'response')
.method('set')

delegate(proto, 'request')
.access('url')
.method('get')
.getter('header')
.getter('headers')