'use strict';

const manifestAddendumBuilder = require('../api/models/manifestAddendumBuilder');
const utilityModel = require('../api/models/utilityModel');
const expect = require('chai').expect;
const sinon = require('sinon');
const manifestDatabaseModel = require('../api/models/manifestDatabaseModel');

function buildInitialResult(innerObjectValue){
	return {
		Response: {
			character: {
				data: innerObjectValue
			},
			manifestAddendum: {}
		}
	};
};

function buildTestInputsForActivities(){
	var activities = [];
	for(var i = 0; i < 2; i++){
		activities.push({ id: i, translatedId: utilityModel.translateHash(i), 
			json: JSON.stringify({ 'activity': i}) 
		});	
	}
	var result = {
		Response: {
			activities: [],
			manifestAddendum: {
				activityInfo: {}
			}
		}
	};
	for(var i = 0, len = activities.length; i < len; i++){
		result.Response.activities.push({activityDetails: {directorActivityHash: activities[i].id}});
	}
	var returnedActivityRows = [];
	for(var i = 0, len = activities.length; i < len; i++){
		returnedActivityRows.push({id: activities[i].translatedId, json: activities[i].json});
	}
	return{
		activities: activities,
		result: result,
		returnedActivityRows: returnedActivityRows
	};
};

describe('Manifest Addendum Builder', function() {
	var mdbModelGetARaceStub;
	var mdbModelGetAClassStub;
	var mdbModelGetAGenderStub;
	var mdbModelGetActivityDetailsStub;
	beforeEach(function(){
		mdbModelGetARaceStub = sinon.stub(manifestDatabaseModel, "getARace");
		mdbModelGetAClassStub = sinon.stub(manifestDatabaseModel, "getAClass");;
		mdbModelGetAGenderStub = sinon.stub(manifestDatabaseModel, "getAGender");;
		mdbModelGetActivityDetailsStub = sinon.stub(manifestDatabaseModel, "getActivityDetails")
	});

	afterEach(function(){
		mdbModelGetARaceStub.restore();
		mdbModelGetAClassStub.restore();
		mdbModelGetAGenderStub.restore();
		mdbModelGetActivityDetailsStub.restore();
	});


	it('should call manifestDatabaseModel to build race info addendum', function(done) {
		var raceInfo = {'race': 'something'};
		var raceJson = JSON.stringify(raceInfo);
		mdbModelGetARaceStub
			.yields(null, [{id: 1, json:raceJson}]);
		var result = buildInitialResult({raceHash: 'meh'});

		manifestAddendumBuilder.buildRaceInfoAddendum(result).then(function(){
			expect(result.Response.manifestAddendum.raceInfo.race).to.equal(raceInfo.race);
			done();
		});
	});

	it('should call manifestDatabaseModel to build class info addendum', function(done){
		var classInfo = {'class': 'something'};
		var classJson = JSON.stringify(classInfo);
		mdbModelGetAClassStub.yields(null, [{id: 1, json: classJson}]);
		var result = buildInitialResult({classHash: 'meh'});

		manifestAddendumBuilder.buildClassInfoAddendum(result).then(function(){
			expect(result.Response.manifestAddendum.classInfo.class).to.equal(classInfo.class);
			done();
		});
	});

	it('should call manifestDatabaseModel to build gender info addendum', function(done){
		var genderInfo = {'gender': 'something'};
		var genderJson = JSON.stringify(genderInfo);
		mdbModelGetAGenderStub.yields(null, [{id: 1, json: genderJson}]);
		var result = buildInitialResult({genderHash: 'meh'});

		manifestAddendumBuilder.buildGenderInfoAddendum(result).then(function(){
			expect(result.Response.manifestAddendum.genderInfo.gender).to.equal(genderInfo.gender);
			done();
		});
	});

	it('should call manifestDatabaseModel to build activities addendum', function(done){
		var testInputs = buildTestInputsForActivities();
		mdbModelGetActivityDetailsStub.yields(null, testInputs.returnedActivityRows);

		manifestAddendumBuilder.buildActivityInfoAddendum(testInputs.result).then(function(){
			for(var i = 0, len = testInputs.activities.length; i < len; i++){
				expect(testInputs.result.Response.manifestAddendum.activityInfo[testInputs.activities[i].translatedId].activity).to.equal(i);
			}
			done();
		});
	});
});