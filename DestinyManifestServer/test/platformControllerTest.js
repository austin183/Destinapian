'use strict';

const rewire = require('rewire');
const expect = require('chai').expect;
const sinon = require('sinon');
const platformController = rewire('../api/controllers/platformController');
const stubbedCache = require('../api/models/cacheModel');
const stubbedRequest = require('request');
const logger = require('../utilities/logger').logger;
const testRespHeader = {
    'header': 'testHeader'
};
const testCachedValue = {
    'value': 'testValue'
};


describe('Platform Controller', function(){
    var requestStub;
    var cacheStub;
    beforeEach(function(){
        requestStub = sinon.stub(stubbedRequest, "get");
        cacheStub = sinon.stub(stubbedCache, "getCachedValue");
        platformController.__set__("getRequest", function(){
            return stubbedRequest;
        });

        platformController.__set__("getRespHeader", function(){
            return testRespHeader;
        });
    });

    afterEach(function(){
        requestStub.restore();
        cacheStub.restore();
    });

    it('should get_destiny2_profile_search from cache with right parameters', function(done){
        var req = {
            params: {
                membershipType: 1,
                profileName: 'name'
            }
        };
        var res = {
            header: function(respHeader){
                expect(respHeader.header).to.equal(testRespHeader.header);
            },
            json: function(result){
                expect(result.value).to.equal(testCachedValue.value);
                done();
            }
        };
        cacheStub.withArgs('profileSearch', req.params.membershipType + '~~' + req.params.profileName)
            .returns(testCachedValue);
        
        platformController.get_destiny2_profile_search(req, res);
    });
});