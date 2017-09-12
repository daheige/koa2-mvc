pm2是一个node.js的进程管理器，因为nodejs的单进程特性，保存进程不死掉，自动重载是十分重要的，目前只支持liunx平台
1.安装pm2 :前提安装了node.js
    $ npm install pm2 -g
2.用pm2启动nodejs应用 ,每一个应用取一个应用名称，不要用系统自己分配应用名称
    cd cas-admin的目录
    pm2 start www --name="cas-admin"
    cd cas-server的目录
    pm2 start app.js --name="cas-server"

    cd anaweb的目录
    pm2 start www --name="anaweb"   

3.常用命令
    查看所有
    <1>.pm2 list
    显示一个进程的nodejs应用详细信息

    <2>.pm2 show id|name;
    pm2 show 1  | pm2 show anaweb

    查看日志 
    <3>.pm2 logs anweb

    使用内存监控
    <3>.pm2 monit
    操作命令
    <4> 停止 删除最常用
    $pm2 stop  <app_name|id|all>  停止
    $pm2 delete <app_name|id|all> 删除
    $pm2 restart <app_name|id|all> 重启
    $pm2 reload <app_name|id|all> 重载
4.关于排错
    error log path  /root/.pm2/pids/anaweb-13.pid 
    错误日志，出现启动 error找她就没错
    out log path    /root/.pm2/logs/anaweb-out-13.log 
    访问日志,做统计是使用

----------------------------------pm2常见命令操作如下--------------------------
$ pm2 start app.js # 启动app.js应用程序
$ pm2 start app.js -i 4 # cluster mode 模式启动4个app.js的应用实例

# 4个应用程序会自动进行负载均衡
$ pm2 start app.js --name="api" # 启动应用程序并命名为 "api"
$ pm2 start app.js --watch # 当文件变化时自动重启应用
$ pm2 start script.sh # 启动 bash 脚本

$ pm2 list # 列表 PM2 启动的所有的应用程序
$ pm2 monit # 显示每个应用程序的CPU和内存占用情况
$ pm2 show [app-name] # 显示应用程序的所有信息

$ pm2 logs # 显示所有应用程序的日志
$ pm2 logs [app-name] # 显示指定应用程序的日志
$ pm2 flush

$ pm2 stop all # 停止所有的应用程序
$ pm2 stop 0 # 停止 id为 0的指定应用程序
$ pm2 restart all # 重启所有应用
$ pm2 reload all # 重启 cluster mode下的所有应用
$ pm2 gracefulReload all # Graceful reload all apps in cluster mode
$ pm2 delete all # 关闭并删除所有应用
$ pm2 delete 0 # 删除指定应用 id 0
$ pm2 scale api 10 # 把名字叫api的应用扩展到10个实例
$ pm2 reset [app-name] # 重置重启数量

$ pm2 startup # 创建开机自启动命令
$ pm2 save # 保存当前应用列表
$ pm2 resurrect # 重新加载保存的应用列表
$ pm2 update # Save processes, kill PM2 and restore processes
$ pm2 generate # Generate a sample json configuration file
http://www.cnblogs.com/xiashan17/p/5896427.html



