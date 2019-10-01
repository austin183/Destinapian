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

const profileReq = {
    params: {
        membershipType: 1,
        profileName: 'name'
    }
};

const standardError = {
    message: 'error'
};

var performRespHeaderTest = function(respHeader){
    expect(respHeader.header).to.equal(testRespHeader.header);
};


describe('Platform Controller', function(){
    var loggerErrorSpy;
    var requestStub;
    var cacheStub_getCachedValue;
    var cacheSpy_setCachedValue;
    var platformOptionsBuilderStub_getDestiny2ProfileSearchOptions;
    beforeEach(function(){
        loggerErrorSpy = sinon.spy(logger, "error");
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

        platformController.__set__("getLogger", function(){
			return logger;
        });
    });

    afterEach(function(){
        loggerErrorSpy.restore();
        requestStub.restore();
        cacheStub_getCachedValue.restore();
        cacheSpy_setCachedValue.restore();
        platformOptionsBuilderStub_getDestiny2ProfileSearchOptions.restore();
    });

    it('should get_destiny2_profile_search from cache with right parameters', function(done){
        var res = {
            header: performRespHeaderTest,
            json: function(result){
                expect(result.value).to.equal(testCachedValue.value);
                done();
            } 
        };
        cacheStub_getCachedValue.withArgs('profileSearch', profileReq.params.membershipType + '~~' + profileReq.params.profileName)
            .returns(testCachedValue);
        
        platformController.get_destiny2_profile_search(profileReq, res);
    });

    it('should get_destiny2_profile_search from request if not in cache', function(done){
        var res = {
            header: performRespHeaderTest,
            json: function(result){
                expect(result.value).to.equal(testRequest.value);
                expect(cacheSpy_setCachedValue.withArgs('profileSearch', profileReq.params.membershipType + '~~' + profileReq.params.profileName, testRequest).calledOnce).to.be.true;
                done();
            }
        };
        cacheStub_getCachedValue.withArgs('profileSearch', profileReq.params.membershipType + '~~' + profileReq.params.profileName)
            .returns('');
        platformOptionsBuilderStub_getDestiny2ProfileSearchOptions
            .withArgs(profileReq.params.membershipType, profileReq.params.profileName)
            .returns(testOptions);
        requestStub.withArgs(testOptions).yields(null, null, JSON.stringify(testRequest));
        platformController.get_destiny2_profile_search(profileReq, res);
    });

    it('should log error if get_destiny2_profile_search if request errored out', function(done){
        var res = {
            header: performRespHeaderTest,
            json: function(result){
                expect(result.value).to.equal(testRequest.value);
                expect(cacheSpy_setCachedValue.withArgs('profileSearch', profileReq.params.membershipType + '~~' + profileReq.params.profileName, testRequest).calledOnce).to.be.true;
                done();
            }
        };
        cacheStub_getCachedValue.withArgs('profileSearch', profileReq.params.membershipType + '~~' + profileReq.params.profileName)
            .returns('');
        platformOptionsBuilderStub_getDestiny2ProfileSearchOptions
            .withArgs(profileReq.params.membershipType, profileReq.params.profileName)
            .returns(testOptions);
        requestStub.withArgs(testOptions).yields(standardError, null, null);
        platformController.get_destiny2_profile_search(profileReq, res);
        expect(loggerErrorSpy.withArgs(standardError.message).calledOnce).to.be.true;
        done();
    });
});