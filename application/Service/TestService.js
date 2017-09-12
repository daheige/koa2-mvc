let BaseService = require(__dirname + '/Base.class');
class TestService extends BaseService {
    constructor() {
        super();
    }
    test() {
        return "test model";
    }
    static getInstance() {
        if (!TestService.instance) {
            TestService.instance = new TestService;
        }
        return TestService.instance;
    }
}
module.exports = TestService.getInstance(); //采用单例模式，隐式返回this
