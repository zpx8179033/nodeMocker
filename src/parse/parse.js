var handle = require('../handle/handle');
var randomData = require('../randomData/randomData');

module.exports = {
    parseConfig(config) {
        let object = {};
        for (let key in config) {
            let currentPropertyValue = null;
            switch (config[key]) {
                case '@name':
                    currentPropertyValue = randomData.cname();
                    break;
                case '@date':
                    currentPropertyValue = randomData.date();
                    break;
                case '@number':
                    currentPropertyValue = randomData.integer(1, 100);
                    break;
                case '@bool':
                    currentPropertyValue = randomData.bool();
                    break;
                case '@dateTimestamp':
                    currentPropertyValue = randomData.dateTimestamp();
                    break;
                default:
                    if (config[key] instanceof Array) {
                        let array = [];
                        if (config[key].length > 0 && config[key][0]) {
                            let count = Math.floor(Math.random() * 20);
                            for (var i = 0; i < count; i++) {
                                array.push(this.parseConfig(config[key][0]))
                            }
                        }
                        currentPropertyValue = array;
                    } else if (config[key] instanceof Object) {
                        currentPropertyValue = this.parseConfig(config[key]);
                    } else {
                        currentPropertyValue = this.dealOtherConfig(config[key]);
                    }
                    break;
            }
            object[key] = currentPropertyValue;
        }
        return object;
    },
    dealOtherConfig(dataType) {
        if (dataType && typeof dataType == 'string') {
            let reg = /[\w\u4E00-\u9FA5\uF900-\uFA2D]+/g;
            let regArr = dataType.match(reg);
            // console.log(dataType);
            // console.log(reg);
            // console.log(regArr);
            if (regArr instanceof Array && regArr[0] === 'string' || regArr[0] === 'int') {
                return handle.createDataByType(regArr);
            } else if (regArr instanceof Array && regArr[0] === 'url') {
                let reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
                let regArr = dataType.match(reg);
                return handle.createDataByType(['url'].concat(regArr));
            } else if (regArr instanceof Array && regArr.length >= 2) {
                return handle.createDataByType(regArr);
            }
        }
        return null;
    }
}
