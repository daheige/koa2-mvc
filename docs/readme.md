```
##author:daheige
##git:daheige
##项目采用nodejs7.6.0+之后的版本，koa2构建
##项目启动管理pm2
    pm2 start bootstrap/boot.json　　　            线上环境启动
    pm2 start bootstrap/boot.json --env test    测试环境启动
                                                env可以指定环境dev,test
##开发环境启动项目：node 　bootstrap/www
##开发参考文档
    https://segmentfault.com/a/1190000009283162
    ## nunjucks用法参考：http://mozilla.github.io/nunjucks/cn/templating.html#part-9d9c663eba1f6097
    http://mozilla.github.io/nunjucks/cn/templating.html
##nodejs参考文档
    http://nodejs.cn/api/
```
