module.exports = {
    //设置公共的header X-Requested-With
    setCommonHeader: function(ctx, next) {
        let isAjax = ctx.get('x-requested-with') || '';
        if (isAjax) {
            ctx.set('Content-Type', 'application/json');//设置请求头
        } else {
            ctx.set('Content-Type', 'text/html;charset=utf-8');
        }
        next();
    }
};
