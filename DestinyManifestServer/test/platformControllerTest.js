'use strict';

const objectHash = require('object-hash');
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
const testResponse = {
    'value': 1,
    'Response':{}
};

const standardError = {
    message: 'error'
};

var performRespHeaderTest = function(respHeader){
    expect(respHeader.header).to.equal(testRespHeader.header);
};

function performRespCachedJsonTest(done) {
    return function (result) {
        expect(result.value).to.equal(testCachedValue.value);
        done();
    };
};

function noOp(){};

var noOpRes = {
    header: noOp,
    json: noOp
};

describe('Platform Controller ', function(){
    var loggerErrorSpy;
    var requestStub;
    var cacheStub_getCachedValue;
    var cacheSpy_setCachedValue;
    var platformOptionsBuilderStub;

    beforeEach(function(){
        loggerErrorSpy = sinon.spy(logger, "error");
        requestStub = sinon.stub(stubbedRequest, "get");
        cacheStub_getCachedValue = sinon.stub(stubbedCache, "getCachedValue");
        cacheSpy_setCachedValue = sinon.spy(stubbedCache, "setCachedValue");
        
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
    });

    describe('get_destiny2_profile_search', function(){
        var req = {
            params: {
                membershipType: 1,
                profileName: 'name'
            }
        };
        var searchTerm = 'profileSearch';
        var searchQuery = req.params.membershipType + '~~' + req.params.profileName;
        beforeEach(function(){
            platformOptionsBuilderStub = sinon.stub(stubbedPlatformOptionsBuilder, "getDestiny2ProfileSearchOptions");
        });
        afterEach(function(){
            platformOptionsBuilderStub.restore();
        });
        it('should get_destiny2_profile_search from cache with right parameters', function(done){
            var res = {
                header: performRespHeaderTest,
                json: performRespCachedJsonTest(done) 
            };
            cacheStub_getCachedValue.withArgs(searchTerm, searchQuery).returns(testCachedValue);
            
            platformController.get_destiny2_profile_search(req, res);
        });
    
        it('should get_destiny2_profile_search from request if not in cache', function(done){
            var res = {
                header: performRespHeaderTest,
                json: function(result){
                    expect(result.value).to.equal(testResponse.value);
                    expect(cacheSpy_setCachedValue.withArgs(searchTerm, searchQuery).calledOnce).to.be.true;
                    done();
                }
            };
            cacheStub_getCachedValue.withArgs(searchTerm, searchQuery).returns('');
            platformOptionsBuilderStub
                .withArgs(req.params.membershipType, req.params.profileName)
                .returns(testOptions);
            requestStub.withArgs(testOptions).yields(null, null, JSON.stringify(testResponse));
            platformController.get_destiny2_profile_search(req, res);
        });
    
        it('should log error if get_destiny2_profile_search if request errored out', function(done){
            cacheStub_getCachedValue.withArgs(searchTerm, searchQuery)
                .returns('');
            platformOptionsBuilderStub
                .withArgs(req.params.membershipType, req.params.profileName)
                .returns(testOptions);
            requestStub.withArgs(testOptions).yields(standardError, null, null);
            platformController.get_destiny2_profile_search(req, noOpRes);
            expect(loggerErrorSpy.withArgs(standardError.message).calledOnce).to.be.true;
            done();
        });
    });

    describe('get_character_activity_history', function(){
        var req = {
            params: {
                membershipType: 1,
                membershipId: 123,
                characterId: 456
            },
            query:{
                something: 'something'
            }
        };
        var searchTerm = 'activityHistory';
        var searchQuery = req.params.membershipType + '~~' + req.params.membershipId + '~~' + req.params.characterId + '~~' + objectHash(req.query);
        var manifestAddendumBuilderStub_buildActivityInfoAddendum;
        var manifestAddendumBuilderStub_buildRaceInfoAddendum;
        var manifestAddendumBuilderStub_buildClassInfoAddendum;
        var manifestAddendumBuilderStub_buildGenderInfoAddendum;
        var platformAddendumBuilderStub_buildPostGameCarnageReport;

        beforeEach(function(){
            platformOptionsBuilderStub = sinon.stub(stubbedPlatformOptionsBuilder, "getCharacterActivityHistoryOptions");
            manifestAddendumBuilderStub_buildActivityInfoAddendum = sinon.stub(stubbedManifestAddendumBuilder, "buildActivityInfoAddendum");
            platformAddendumBuilderStub_buildPostGameCarnageReport = sinon.stub(stubbedPlatformAddendumBuilder, "buildPostGameCarnageReport");
        });

        afterEach(function(){
            platformOptionsBuilderStub.restore();
            manifestAddendumBuilderStub_buildActivityInfoAddendum.restore();
            platformAddendumBuilderStub_buildPostGameCarnageReport.restore();
        });
        
        it('should get_character_activity_history from cache with right parameters', function(done){
            var res = {
                header: performRespHeaderTest,
                json: performRespCachedJsonTest(done)
            };
            cacheStub_getCachedValue.withArgs(searchTerm, searchQuery)
                .returns(testCachedValue);
            
            platformController.get_character_activity_history(req, res);
        });

        it('should get_character_activity_history from request when not in cache', function(done){
            var res = {
                header: performRespHeaderTest,
                json: function(result){
                    expect(result.value).to.equal(testResponse.value);
                    expect(cacheSpy_setCachedValue.withArgs(searchTerm, searchQuery).calledOnce).to.be.true;
                    done();
                }
            };
            cacheStub_getCachedValue.withArgs(searchTerm, searchQuery).returns('');
            platformOptionsBuilderStub
                .withArgs(req.params.membershipType, req.params.membershipId, req.params.characterId, req.query)
                .returns(testOptions);
            requestStub.withArgs(testOptions).yields(null, null, JSON.stringify(testResponse));
            manifestAddendumBuilderStub_buildActivityInfoAddendum.resolves();
            platformAddendumBuilderStub_buildPostGameCarnageReport.resolves();
            platformController.get_character_activity_history(req, res);
        });
        
        it('should log error if get_character_activity_history request errored out', function(done){
            cacheStub_getCachedValue.withArgs(searchTerm, searchQuery)
                .returns('');
                platformOptionsBuilderStub
                .withArgs(req.params.membershipType, req.params.membershipId, req.params.characterId, req.query)
                .returns(testOptions);
            requestStub.withArgs(testOptions).yields(standardError, null, null);
            platformController.get_character_activity_history(req, noOpRes);
            expect(loggerErrorSpy.withArgs(standardError.message).calledOnce).to.be.true;
            done();
        });
    });

    describe('get_destiny2_profile', function(){
        var req = {
            params: {
                membershipType: 1,
                membershipId: 123
            },
            query:{
                something: 'something'
            }
        };
        var searchTerm = 'profile';
        var searchQuery = req.params.membershipType + '~~' + req.params.membershipId + '~~' + objectHash(req.query);

        beforeEach(function(){
            platformOptionsBuilderStub = sinon.stub(stubbedPlatformOptionsBuilder, "getDestiny2ProfileOptions");
        });

        afterEach(function(){
            platformOptionsBuilderStub.restore();
        });

        it('should get_destiny2_profile from cache with right parameters', function(done){
            var res = {
                header: performRespHeaderTest,
                json: performRespCachedJsonTest(done)
            };
            cacheStub_getCachedValue.withArgs(searchTerm, searchQuery)
                .returns(testCachedValue);
            
            platformController.get_destiny2_profile(req, res);
        });

        it('should get_destiny2_profile from request if not in cache', function(done){
            var res = {
                header: performRespHeaderTest,
                json: function(result){
                    expect(result.value).to.equal(testResponse.value);
                    expect(cacheSpy_setCachedValue.withArgs(searchTerm, searchQuery).calledOnce).to.be.true;
                    done();
                }
            };
            cacheStub_getCachedValue.withArgs(searchTerm, searchQuery).returns('');
            platformOptionsBuilderStub
                .withArgs(req.params.membershipType, req.params.membershipId, req.query)
                .returns(testOptions);
            requestStub.withArgs(testOptions).yields(null, null, JSON.stringify(testResponse));
            platformController.get_destiny2_profile(req, res);
        });

        it('should log error if get_destiny2_profile request errored out', function(done){
            cacheStub_getCachedValue.withArgs(searchTerm, searchQuery)
                .returns('');
                platformOptionsBuilderStub
                .withArgs(req.params.membershipType, req.params.membershipId, req.query)
                .returns(testOptions);
            requestStub.withArgs(testOptions).yields(standardError, null, null);
            platformController.get_destiny2_profile(req, noOpRes);
            expect(loggerErrorSpy.withArgs(standardError.message).calledOnce).to.be.true;
            done();
        });
    });
});
