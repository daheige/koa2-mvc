const Koa = require('koa');
const views = require('koa-views');
const nunjucks = require('nunjucks'); //采用nunjucks模板
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const koaStatic = require('koa-static');

//设置app运行环境和端口，网站根目录
Object.defineProperty(global, 'APP_ENV', {
    value: (process.env.NODE_ENV || 'production').toLowerCase(),
    writable: false,
    configurable: false,
});
const env_info = require(__dirname + '/bootstrap/env/' + APP_ENV);
Object.defineProperty(global, 'ENV_INFO', {
    value: env_info,
    writable: false,
    configurable: false,
});
Object.defineProperty(global, 'ROOT_PATH', {
    value: __dirname,
    writable: false,
    configurable: false,
});
Object.defineProperty(global, 'APP_PATH', {
    value: __dirname + '/application',
    writable: false,
    configurable: false,
});

//定义系统常量
const constants = require(APP_PATH + '/config/constants');
for (let i in constants) {
    Object.defineProperty(global, i, {
        value: constants[i],
        writable: false,
        configurable: false,
    });
}

//导入全局配置文件和系统全局函数
const config = require(APP_PATH + '/config/config');
let functions_list = config.functions_list;
global.helper = {};
for (let i in functions_list) {
    if (functions_list[i]) {
        let fnObj = require(APP_PATH + '/Libray/' + i);
        for (let func in fnObj) {
            if (typeof fnObj[func] != 'function') {
                continue;
            }
            Object.defineProperty(helper, func, {
                value: fnObj[func],
                writable: false,
                configurable: false,
            });
        }
    }
}
delete config.functions_list; //删除functions_list属性
Object.defineProperty(global, 'config', {
    value: config,
    writable: false,
    configurable: false,
});

//启动app
let app = new Koa();
//系统全局middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json());
app.use(logger());

//静态资源目录设置，可以根据项目具体配置，如果走nginx反向代理请注释如下代码
// if (['dev','testing'].includes(APP_ENV)) {
    app.use(koaStatic(PUBLIC_PATH)); //静态资源根目录设置
// }

//模板配置
//如果需要添加nunjucks过滤器请打开下面代码
nunjucks.configure(VIEW_DIR, {
    autoescape: true
}).addFilter('json', JSON.stringify).addFilter('hgtest', function(str) {
    return str + 'haha';
});
app.use(views(VIEW_DIR, {
    extension: 'html',
    cache: false,
    map: { html: 'nunjucks' }
}));

// logger打印日志中间件
app.use(async(ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - cost:${ms}ms`);
    ctx.response.set('x-request-time', ms + 'ms');
});

//设置客户端常量
app.use(async(ctx,next) => {
    ctx.state.constants = constants;
    await next();
});
//路由分离，绑定到控制器
const koaRouter = require('koa-router')();//路由实例对象
const routers = require(ROUTES_DIR + '/index')(koaRouter);
app.use(routers.routes(), routers.allowedMethods());

//错误处理
if(['dev','testing'].includes(APP_ENV)){
    onerror(app);
}

module.exports = app;
