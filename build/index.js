"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const ejs = require("koa-ejs");
const KoaRouter = require("koa-router");
const serve = require("koa-static");
const qs = require("querystring");
const io = require("socket.io");
const url = require("url");
class Server {
    constructor() {
        this.port = 80;
        this.host = '0.0.0.0';
        this.app = new Koa();
        this.config();
        this.route();
        this.io = io(this.app.listen(this.port, this.host));
        this.io.on('connection', (socket) => this.handleSocket(socket));
    }
    static bootstrap() {
        return new Server();
    }
    /**
     * 中间件定义
     */
    config() {
        this.app.use(async (ctx, next) => {
            await next();
        });
        this.app.use(serve(__dirname + '/../public'));
        ejs(this.app, {
            root: __dirname + '/../views',
            layout: 'layout',
            viewExt: 'html',
            cache: false,
            debug: false,
        });
    }
    /**
     * 路由定义
     */
    route() {
        this.router = new KoaRouter();
        this.router.get('/', async (ctx) => {
            await ctx.render('index');
        });
        this.router.get('/documents', async (ctx) => {
            await ctx.render('documents');
        });
        this.router.get('/debug', async (ctx) => {
            await ctx.render('debug');
        });
        this.router.get('/test', async (ctx) => {
            await ctx.render('test');
        });
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
    }
    /**
     * socket
     * @param socket
     */
    handleSocket(socket) {
        const q = qs.parse(url.parse(socket.handshake.url).query);
        if (!q.token) {
            socket.disconnect(true);
            return;
        }
        socket.join(q.token);
        socket.on('log', (message, level) => {
            this.io.to(q.token).emit('log', `[${(new Date()).toLocaleString()}] ${message}`, level);
        });
        const welcome = `${socket.handshake.headers['user-agent']} connected`;
        this.io.to(q.token).emit('log', `[${(new Date()).toLocaleString()}] ${welcome}`, 'trace');
    }
}
Server.bootstrap();
//# sourceMappingURL=index.js.map