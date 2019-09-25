'use strict';

const rewire = require('rewire');
const expect = require('chai').expect;
const sinon = require('sinon');
const logger = require('../utilities/logger').logger;
const stubbedCache = require('../api/models/cacheModel'); 
const stubbedPlatformOptionsBuilder = require('../api/models/platformRequestOptionsBuilder');
const stubbedRequest = require('request');

const platformAddendumBuilder = rewire('../api/models/platformAddendumBuilder');

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

    beforeEach(function(){
        cacheStub = sinon.stub(stubbedCache, "getCachedValue");
        activityCount = 3;
        activities = buildActivities(activityCount);
        result = { 
            Response: {
                activities: activities
            }
        };

    });

    afterEach(function(){
        cacheStub.restore();
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
});