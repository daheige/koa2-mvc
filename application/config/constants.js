//基本的常量配置
let js_base_path = APP_ENV != 'production' ? 'js_src/' : 'js/';
let assets_domain = '/';
module.exports = {
    PUBLIC_PATH: ROOT_PATH + '/public',
    VIEW_DIR : APP_PATH+'/views',
    ROUTES_DIR : APP_PATH+'/routes',
    APP_NAME   : 'daheige_koa',
    APP_VERSION : '1.0.0',
    ASSETS_STATIC : assets_domain,
    JS_SRC: assets_domain + js_base_path,
}
