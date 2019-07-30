import * as Koa from 'koa';
import * as ejs from 'koa-ejs';
import * as KoaRouter from 'koa-router';
import * as serve from 'koa-static';
import * as qs from 'querystring';
import * as io from 'socket.io';
import * as url from 'url';

class Server {
  public static bootstrap(): Server {
    return new Server();
  }

  private app: Koa;
  private io: SocketIO.Server;
  private router: KoaRouter;
  private port: number = Number(process.env.PORT || 8080);
  private host: string = process.env.HOST || '0.0.0.0';

  constructor() {
    this.app = new Koa();
    this.config();
    this.route();
    this.io = io(this.app.listen(this.port, this.host, () => console.log('listen on %s:%d', this.host, this.port)));
    this.io.on('connection', (socket) => this.handleSocket(socket));
  }

  /**
   * 中间件定义
   */
  private config() {
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
  private route() {
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
  private handleSocket(socket: SocketIO.Socket) {
    const q: any = qs.parse(url.parse(socket.handshake.url).query);
    if (!q.token) {
      socket.disconnect(true);
      return;
    }
    socket.join(q.token);
    socket.on('log', (message: any, level: string) => {
      this.io.to(q.token).emit('log', `[${(new Date()).toLocaleString()}] ${message}`, level);
    });
    const welcome = `${socket.handshake.headers['user-agent']} connected`;
    this.io.to(q.token).emit('log', `[${(new Date()).toLocaleString()}] ${welcome}`, 'trace');
  }
}

Server.bootstrap();
