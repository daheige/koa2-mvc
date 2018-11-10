const fs = require("fs")
module.exports = {
    test: function(ctx, next) {
        ctx.body = "this is test";
    },
    index: async function(ctx, next) { //异步函数处理，koa路由调用控制器的方法，建议用async...await方式
        // console.log(ctx.headers);
        console.log(ctx.get('user-agent'));
        ctx.body = "this is a async test";
    },
    foo: async function(ctx, next) {
        await ctx.render('Index/foo', {
            title: 'foo test',
            user: 'daheige'
        });
    },
    info: async (ctx, next) => { //通过readStream方式读取文件
        ctx.response.type = 'text/html';
        ctx.response.body = await fs.createReadStream(APP_PATH + '/views/common/index.html');
    }
};
