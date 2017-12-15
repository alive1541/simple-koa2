'use strict'

const typeis = require('type-is')

module.exports = {
	get url(){
		return this.req.url
	},
	is(types) {
		if (!types) return typeis(this.req);
	    if (!Array.isArray(types)) types = [].slice.call(arguments);
	    return typeis(this.req, types);
	},
	get(field) {
	    const req = this.req;
	    switch (field = field.toLowerCase()) {
	      case 'referer':
	      case 'referrer':
	        return req.headers.referrer || req.headers.referer || '';
	      default:
	        return req.headers[field] || '';
	    }
	},
	set header(val) {
	    this.req.headers = val;
	},
	set headers(val) {
	    this.req.headers = val;
	},
}

