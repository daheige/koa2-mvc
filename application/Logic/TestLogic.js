let BaseLogic = require(__dirname + '/Base.class');
class TestLogic extends BaseLogic {
    constructor() {
        super();
    }
    test() {
        return "test logic";
    }
    static getInstance() {
        if (!TestLogic.instance) {
            TestLogic.instance = new TestLogic;
        }
        return TestLogic.instance;
    }
}
module.exports = TestLogic.getInstance(); //采用单例模式，隐式返回this
