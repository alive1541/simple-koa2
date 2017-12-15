'use strict'

const Emitter = require('events')
const http = require('http')
const compose = require('koa-compose')
const context = require('./context')
const request = require('./request')
const response = require('./response')

module.exports = class Application extends Emitter {
	constructor(server) {
		super()
		this.middleware = []
		this.context = Object.create(context)
		this.request = Object.create(request)
		this.response = Object.create(response)
	}

	listen(...args) {
		const server = http.createServer(this.callback())
		return server.listen(...args)
	}

	callback() {
		const fn = compose(this.middleware)
		const handleRequest = (req, res) => {
			const ctx = this.createContext(req, res)
			return this.handleRequest(ctx, fn)
		}

		return handleRequest
	}

	use(fn) {
		this.middleware.push(fn)
		return this
	}

	createContext(req, res) {
		const context = Object.create(this.context);
	    const request = context.request = Object.create(this.request);
	    const response = context.response = Object.create(this.response);
	    context.app = request.app = response.app = this;
	    context.req = request.req = response.req = req;
	    context.res = request.res = response.res = res;
	    request.ctx = response.ctx = context;
	    request.response = response;
	    response.request = request;
	    context.originalUrl = request.originalUrl = req.url;
	    // context.cookies = new Cookies(req, res, {
	    //   keys: this.keys,
	    //   secure: request.secure
	    // });
	    // request.ip = request.ips[0] || req.socket.remoteAddress || '';
	    // context.accept = request.accept = accepts(req);
	    context.state = {};
	    return context;
	}

	handleRequest(ctx, fnMiddleware) {
		// const res = ctx.res;
	 //    res.statusCode = 404;
	    // const onerror = err => ctx.onerror(err);
	    const handleResponse = () => respond(ctx);
	    // onFinished(res, onerror);
	    return fnMiddleware(ctx).then(handleResponse)
	}

}

function respond(ctx) {
	const res = ctx.res
	let body = ctx.body
	// responses
	if (Buffer.isBuffer(body)) return res.end(body);
	if ('string' == typeof body) return res.end(body);
	body = JSON.stringify(body);
	res.end(body);
}	