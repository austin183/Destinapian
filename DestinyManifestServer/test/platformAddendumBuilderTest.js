'use strict';

const rewire = require('rewire');
const expect = require('chai').expect;
const sinon = require('sinon');
const logger = require('../utilities/logger').logger;
const stubbedCache = require('../api/models/cacheModel'); 
const stubbedPlatformOptionsBuilder = require('../api/models/platformRequestOptionsBuilder');
const stubbedRequest = require('request');

const platformAddendumBuilder = rewire('../api/models/platformAddendumBuilder');

const standardError = { message: 'pabt hi there'};

function buildActivities(activityCount){
    var activities = [];
    for(var i = 0; i < activityCount; i++){
        var activity = {
            activityDetails: {
                instanceId: i
            }
        };
        activities.push(activity);
    }
    return activities;
}

describe('Platform Addendum Builder', function(){
    var result;
    var activityCount;
    var activities = [];
    var cacheStub;
    var platformOptionsBuilderStub;
    var requestGetStub;
    var loggerErrorSpy;
    
    beforeEach(function(){
        loggerErrorSpy = sinon.spy(logger, "error");
        cacheStub = sinon.stub(stubbedCache, "getCachedValue");
        platformOptionsBuilderStub = sinon.stub(stubbedPlatformOptionsBuilder, "getPostGameCarnageReportOptions");
        requestGetStub = sinon.stub(stubbedRequest, "get");
        activityCount = 3;
        activities = buildActivities(activityCount);
        result = { 
            Response: {
                activities: activities
            }
        };
        platformAddendumBuilder.__set__("getLogger", function(){
			return logger;
        });

    });

    afterEach(function(){
        cacheStub.restore();
        platformOptionsBuilderStub.restore();
        requestGetStub.restore();
        loggerErrorSpy.restore();
    });
    

    it('should build postGameCarnageReport from cache', function(done){
        for(var i = 0; i < activityCount; i++){
            cacheStub.withArgs('PostGameCarnageReport', i).returns({
                reportValue: i
            });
        }
        platformAddendumBuilder.buildPostGameCarnageReport(result).then(function(){
            for(var i = 0; i < activityCount; i++){
                expect(result.Response.platformAddendum.postGameCarnageReport[i].reportValue).to.equal(i);
            }
            done();
        });
    });

    it('should build postGameCarnageReport from request', function(done){
        for(var i = 0; i < activityCount; i++){
            var options = {option: i};
            var reportValue = JSON.stringify({reportValue: i});
            platformOptionsBuilderStub.withArgs(i).returns(options);
            requestGetStub.withArgs(options).yields(null, null, reportValue);
        }
        platformAddendumBuilder.buildPostGameCarnageReport(result).then(function(){
            for(var i = 0; i < activityCount; i++){
                expect(result.Response.platformAddendum.postGameCarnageReport[i].reportValue).to.equal(i);
            }
            done();
        });
    });

    it('should log error from postGameCarnageReport promises', function(done){
        for(var i = 0; i < activityCount; i++){
            var options = {option: i};
            platformOptionsBuilderStub.withArgs(i).returns(options);
            if(i != 2){
                var reportValue = JSON.stringify({reportValue: i});
                requestGetStub.withArgs(options).yields(null, null, reportValue);
            }
            else{
                requestGetStub.withArgs(options).yields(standardError, null, null);
            }
            
        }
        platformAddendumBuilder.buildPostGameCarnageReport(result).then(function(){
            expect('Should not have reached this case because it should be rejected').to.equal('');
        }).catch(function(){
            expect(loggerErrorSpy.withArgs(standardError.message).calledOnce).to.be.true;
            done();
        });
    });
});