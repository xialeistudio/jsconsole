import * as Koa from 'koa';
import * as ejs from 'koa-ejs';
import * as KoaRouter from 'koa-router';
import * as serve from 'koa-static';
import * as views from 'koa-views';

class Server {
    public static bootstrap(): Server {
        return new Server();
    }

    private app: Koa;
    private router: KoaRouter;
    private port: number = parseInt(process.env.PORT!, 10) || 8080;

    constructor() {
        this.app = new Koa();
        this.route();
        this.config();
        this.app.listen(this.port);
    }

    /**
     * 中间件定义
     */
    private config() {
        this.app.use(serve(__dirname + '/../public'));
        ejs(this.app, {
            root: __dirname + '/../views',
            layout: 'layout',
            viewExt: 'ejs',
            cache: false,
            debug: false,
        });
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
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
    }
}

Server.bootstrap();
