"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Koa = require("koa");
var ejs = require("koa-ejs");
var KoaRouter = require("koa-router");
var serve = require("koa-static");
var qs = require("querystring");
var io = require("socket.io");
var url = require("url");
var Server = (function () {
    function Server() {
        var _this = this;
        this.port = parseInt(process.env.PORT, 10) || 8080;
        this.app = new Koa();
        this.config();
        this.route();
        this.io = io(this.app.listen(this.port));
        this.io.on('connection', function (socket) { return _this.handleSocket(socket); });
    }
    Server.bootstrap = function () {
        return new Server();
    };
    /**
     * 中间件定义
     */
    Server.prototype.config = function () {
        var _this = this;
        this.app.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, next()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.app.use(serve(__dirname + '/../public'));
        ejs(this.app, {
            root: __dirname + '/../views',
            layout: 'layout',
            viewExt: 'html',
            cache: false,
            debug: false,
        });
    };
    /**
     * 路由定义
     */
    Server.prototype.route = function () {
        var _this = this;
        this.router = new KoaRouter();
        this.router.get('/', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.render('index')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.router.get('/documents', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.render('documents')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.router.get('/debug', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.render('debug')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.router.get('/test', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.render('test')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
    };
    /**
     * socket
     * @param socket
     */
    Server.prototype.handleSocket = function (socket) {
        var _this = this;
        var q = qs.parse(url.parse(socket.handshake.url).query);
        if (!q.token) {
            socket.disconnect(true);
            return;
        }
        socket.join(q.token);
        socket.on('log', function (message, level) {
            console.log(message, level);
            _this.io.to(q.token).emit('log', "[" + (new Date()).toLocaleString() + "] " + message, level);
        });
        var welcome = socket.handshake.headers['user-agent'] + " connected";
        this.io.to(q.token).emit('log', "[" + (new Date()).toLocaleString() + "] " + welcome, 'trace');
    };
    return Server;
}());
Server.bootstrap();
//# sourceMappingURL=index.js.map