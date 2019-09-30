'use strict';

const rewire = require('rewire');
const expect = require('chai').expect;
const sinon = require('sinon');
const platformController = rewire('../api/controllers/platformController');
const stubbedCache = require('../api/models/cacheModel');
const stubbedRequest = require('request');
const stubbedPlatformOptionsBuilder = require('../api/models/platformRequestOptionsBuilder');
const stubbedPlatformAddendumBuilder = require('../api/models/platformAddendumBuilder');
const stubbedManifestAddendumBuilder = require('../api/models/manifestAddendumBuilder');
const logger = require('../utilities/logger').logger;
const testRespHeader = {
    'header': 'testHeader'
};
const testCachedValue = {
    'value': 'testValue'
};
const testOptions = {
    'option': 1
};
const testRequest = {
    'value': 1
};


describe('Platform Controller', function(){
    var requestStub;
    var cacheStub_getCachedValue;
    var cacheSpy_setCachedValue;
    var platformOptionsBuilderStub_getDestiny2ProfileSearchOptions;
    beforeEach(function(){
        requestStub = sinon.stub(stubbedRequest, "get");
        cacheStub_getCachedValue = sinon.stub(stubbedCache, "getCachedValue");
        cacheSpy_setCachedValue = sinon.spy(stubbedCache, "setCachedValue");
        platformOptionsBuilderStub_getDestiny2ProfileSearchOptions = sinon.stub(stubbedPlatformOptionsBuilder, "getDestiny2ProfileSearchOptions");
        platformController.__set__("getRequest", function(){
            return stubbedRequest;
        });

        platformController.__set__("getRespHeader", function(){
            return testRespHeader;
        });
    });

    afterEach(function(){
        requestStub.restore();
        cacheStub_getCachedValue.restore();
        cacheSpy_setCachedValue.restore();
        platformOptionsBuilderStub_getDestiny2ProfileSearchOptions.restore();
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
        cacheStub_getCachedValue.withArgs('profileSearch', req.params.membershipType + '~~' + req.params.profileName)
            .returns(testCachedValue);
        
        platformController.get_destiny2_profile_search(req, res);
    });

    it('should get_destiny2_profile_search from request if not in cache', function(done){
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
                expect(result.value).to.equal(testRequest.value);
                expect(cacheSpy_setCachedValue.withArgs('profileSearch', req.params.membershipType + '~~' + req.params.profileName, testRequest).calledOnce).to.be.true;
                done();
            }
        };
        cacheStub_getCachedValue.withArgs('profileSearch', req.params.membershipType + '~~' + req.params.profileName)
            .returns('');
        platformOptionsBuilderStub_getDestiny2ProfileSearchOptions
            .withArgs(req.params.membershipType, req.params.profileName)
            .returns(testOptions);
        requestStub.withArgs(testOptions).yields(null, null, JSON.stringify(testRequest));
        platformController.get_destiny2_profile_search(req, res);
    });
});