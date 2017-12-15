'use strict'

module.exports = {
	set header(val){
		for(let item in val){
			this.res.setHeader(item,val[item])
		}
	},
	set status(code) {
	    assert('number' == typeof code, 'status code must be a number');
	    assert(statuses[code], `invalid status code: ${code}`);
	    assert(!this.res.headersSent, 'headers have already been sent');
	    this._explicitStatus = true;
	    this.res.statusCode = code;
	    if (this.req.httpVersionMajor < 2) this.res.statusMessage = statuses[code];
	    if (this.body && statuses.empty[code]) this.body = null;
	}
}