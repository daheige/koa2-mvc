/**
 * @author:daheige
 * @git:daheige
 * @time:2017-08-10
 * @address:shenzhen,China
 * 使用之前请安装redis2.8.0
 * npm install -g redis
 * 用法
 * var redisHandler = require('./redisHandler')
 * var redisObj = redisHandler.getInstance(redis_config);
 * redisObj.setVal('username','heige');
 * //redisObj.getVal('username');
 * var redisProxy = redisObj.getProxy();
 * redisProxy.set('strname','heige'); //其实就是this.client
 * 获取getVal
 * var redisHandler = require('./redisHandler');
    var co = require('co'); //nodejs7.6.0+的版本不需要用co，请用async,await替代
    var redisObj = redisHandler();
    // redisObj.setBylock('user',{x:1,y:2});
    co(function* (){
        var obj = yield redisObj.getByLock('user');
        console.log(obj);
        console.log(1);
    });

    redisObj.getByLock('user').then(function(res){
        console.log(res);
    },function(err){
        console.log(err);
    })
 * 常见用法
 *  this.client.set("string key", "string val", function (err, reply){});
 *  this.client.hset("hash key", "hashtest 1", "some value", redis.print);
 *  this.client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
    this.client.hkeys("hash key", function (err, replies) {
        console.log(replies.length + " replies:");
        replies.forEach(function (reply, i) {
            console.log("    " + i + ": " + reply);
        });
        client.quit();
    });
 * 其他用法
 *
 *  this.client.hmset(["key", "test keys 1", "test val 1", "test keys 2", "test val 2"], function (err, res) {});
 *  Works the same as
    this.client.hmset("key", ["test keys 1", "test val 1", "test keys 2", "test val 2"], function (err, res) {});
    Or
    this.client.hmset("key", "test keys 1", "test val 1", "test keys 2", "test val 2", function (err, res) {});
   集合操作
   var args = [ 'myzset', 1, 'one', 2, 'two', 3, 'three', 99, 'ninety-nine' ];
    this.client.zadd(args, function (err, response) {
    if (err) throw err;
    console.log('added '+response+' items.');

    // -Infinity and +Infinity also work
    var args1 = [ 'myzset', '+inf', '-inf' ];
    this.client.zrevrangebyscore(args1, function (err, response) {
        if (err) throw err;
        console.log('example1', response);
        // write your code here
    });

    var max = 3, min = 1, offset = 1, count = 2;
    var args2 = [ 'myzset', max, min, 'WITHSCORES', 'LIMIT', offset, count ];
    this.client.zrevrangebyscore(args2, function (err, response) {
        if (err) throw err;
        console.log('example2', response);
        // write your code here
    });
});
 */
'use strict';
class redisHandler { //采用单例模式进行redis连接
    constructor(redis_config) {
        if (typeof redisHandler.instance != 'undefined') {
            return redisHandler.instance;
        }

        if (typeof redis_config == 'undefined') {
            redis_config = {
                port: '6379',
                host: '127.0.0.1',
                options: {}
            };
        }
        this.port = redis_config.port;
        this.host = redis_config.host;
        this.options = redis_config.options;
        let redis = require('redis');
        this.client = redis.createClient(this.port, this.host, this.options);
        this.printFn = function() {};
        this.client.on('connect', function() {
            console.log('ok');
        });
        this.client.on('error', function(err) {
            console.log("Error " + err);
        });

        redisHandler.instance = this;
    }

    static getInstance(redis_config) {
        if (!redisHandler.instance) {
            redisHandler.instance = new redisHandler(redis_config);
        }

        return redisHandler.instance;
    }

    /**
     * 设置Redis自动转换为json，防止缓存击穿
     */
    setBylock(key, value, expire = 0) {
        expire = parseInt(expire) > 0 ? parseInt(expire) : 600;
        let r_exp = expire + 100;
        let c_exp = Math.floor((new Date()).getTime() / 1000) + expire;
        let arg = JSON.stringify({
            data: value,
            expire: c_exp
        });
        this.client.set(key, arg);
        this.client.del(key + '.lock');
    }
    //获取redis的值，自动格式化为对象，通过Promise的方式返回获取的结果
    getByLock(key) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.client.get(key, function(err, res) {
                if (err) return reject(false);
                if (res === false || res == null) {
                    return resolve({});
                } else {
                    res = JSON.parse(res);
                    if (typeof res.expire == 'undefined' || Math.floor(res.expire) <= (new Date()).getTime() / 1000) {
                        let lock = _this.client.incr(key + '.lock', _this.printFn);
                        if (lock == 1) {
                            return resolve({});
                        }
                        return resolve(typeof res.data != 'undefined' ? res.data : res);
                    } else {
                        return resolve(res.data);
                    }
                }
            });
        });
    }

    setEx(key, val, time = 300, fn) {
        this.client.set(key, val, 'EX', time);
        if (typeof fn == 'function') fn();
    }

    setVal(key, val, fn) {
        this.client.set(key, val, fn || this.printFn);
    }

    getVal(key, fn) { //通过Promise的方式返回获取的结果
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.client.get(key, function(err, value) {
                if (err) return reject(false);

                if (typeof fn == 'function') fn();
                return resolve(value ? value : false);
            });
        });
    }

    getProxy() { //提供redis操作的句柄client，可以直接调用redis的命名执行操作
        return this.client;
    }
}

module.exports = redisHandler;
