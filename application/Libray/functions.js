module.exports = {
    redis: function(redis_config) {
        let redisHandler = require('./redisHandler');
        return redisHandler(redis_config); //返回redisObj操作句柄
    }
};
