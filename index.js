/**
 * Created by zpx on 2017/11/3.
 */

/**
 * node mock功能，拦截请求
 *
 * @date 2017-10-30
 * @author zhangpengxiao
 */

'use strict';
const parse = require('./src/parse/parse');
const mockConfig = require('../../nodemocker.config');

module.exports = function(req, res ,next){
    const mockService = {
        isMock : mockConfig.isOpen,
        checkUrl(url){
            let mockProperty = mockConfig.urlData.filter((item)=>{
                    return item.url.split('?')[0] === url.split('?')[0];
        });
            if(mockProperty && mockProperty.length>0){
                let mockData = new MockData(mockProperty[0]);
                return mockData.init();
            }else{
                return null;
            }
        }
    }

    class MockData{
        constructor(config){
            this.config = config;
            this.data = null;
        }
        init(){
            return parse.parseConfig(this.config.data);
        }
    }

    var successMock = function (resp, data) {
        resp.writeHead(200, { 'Content-Type': "application/json" });
        resp.end(JSON.stringify(data));
    }

    if(mockService.isMock == true){
        let mockData = mockService.checkUrl(req.url);
        if(mockData){
            successMock(res, mockData);
            return true;
        }
    }
    next();
}
