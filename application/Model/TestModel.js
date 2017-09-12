let BaseModel = require(__dirname + '/Base.class');
class TestModel extends BaseModel {
    constructor() {
        super();
    }
    test() {
        return "test model";
    }
    static getInstance() {
        if (!TestModel.instance) {
            TestModel.instance = new TestModel;
        }
        return TestModel.instance;
    }
}
module.exports = TestModel.getInstance(); //采用单例模式，隐式返回this
