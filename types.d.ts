declare module 'koa-ejs' {
    import * as Koa from 'koa';
    interface Options {
        root: string;
        layout?: string;
        viewExt?: string;
        cache?: boolean;
        debug?: boolean;
    }
    namespace render {
    }
    function render(app: Koa, options?: Options): void;

    export = render;
}
