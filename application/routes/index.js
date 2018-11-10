function setRouter(router) {
    router.prefix('/'); //设置路由前缀
    router.get('/', async (ctx, next) => {
        await ctx.render('index', {
            title: 'Hello Koa 2!',
            user: 'daheige',
            info: {
                id: 1,
                age: 12
            }
        })
    });

    router.get('/bar', function(ctx, next) {
        ctx.body = 'this is a bar response'
    });

    router.get('/string', async (ctx, next) => {
        ctx.body = 'koa2 string'
    })

    router.get('/json', async (ctx, next) => {
        ctx.body = {
            title: 'koa2 json'
        }
    });
    router.get('/foo', helper.controller('Index', 'foo'));
    router.get('/test', helper.controller('Index', 'test'));

    router.get('/api', async (ctx, next) => {
        ctx.body = {
            title: 'koa2 json',
            user: 'heige'
        }
    });

    router.get('/index', helper.ware('common', 'setCommonHeader'), helper.controller('Index', 'index'));
    router.get('/api/index', helper.controller('api/Demo', 'index'));

    return router;
}

module.exports = setRouter;
