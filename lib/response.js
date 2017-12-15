'use strict'

module.exports = {
	set body(val) {
		console.log('body')
		const original = this._body;
	    this._body = val;

	    if (this.res.headersSent) return;

	    // no content
	    if (null == val) {
	      if (!statuses.empty[this.status]) this.status = 204;
	      this.remove('Content-Type');
	      this.remove('Content-Length');
	      this.remove('Transfer-Encoding');
	      return;
	    }

	    // set the status
	    if (!this._explicitStatus) this.status = 200;

	    // set the content-type only if not yet set
	    const setType = !this.header['content-type'];

	    // string
	    if ('string' == typeof val) {
	      if (setType) this.type = /^\s*</.test(val) ? 'html' : 'text';
	      this.length = Buffer.byteLength(val);
	      return;
	    }

	    // buffer
	    if (Buffer.isBuffer(val)) {
	      if (setType) this.type = 'bin';
	      this.length = val.length;
	      return;
	    }

	    // stream
	    if ('function' == typeof val.pipe) {
	      onFinish(this.res, destroy.bind(null, val));
	      ensureErrorHandler(val, err => this.ctx.onerror(err));

	      // overwriting
	      if (null != original && original != val) this.remove('Content-Length');

	      if (setType) this.type = 'bin';
	      return;
	    }

	    // json
	    this.remove('Content-Length');
	    this.type = 'json';
	},
	set status(code) {
	    assert('number' == typeof code, 'status code must be a number');
	    assert(statuses[code], `invalid status code: ${code}`);
	    assert(!this.res.headersSent, 'headers have already been sent');
	    this._explicitStatus = true;
	    this.res.statusCode = code;
	    if (this.req.httpVersionMajor < 2) this.res.statusMessage = statuses[code];
	    if (this.body && statuses.empty[code]) this.body = null;
	},
}