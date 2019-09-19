'use strict';

const rewire = require('rewire');
const manifestDatabaseModel = rewire('../api/models/manifestDatabaseModel');
const expect = require('chai').expect;
const sinon = require('sinon');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(":memory:");
const standardDbResult = {id: 1, 
	json: {something: 'hello'}
};
const standardError = {message: 'hi there'};

describe('Manifest Database Model', function() {
	var stub = sinon.stub(db, "all");
	stub.yields("Error", null);
	beforeEach(function(){
		manifestDatabaseModel.__set__("getDatabase", function(){
			return db;
		});
	});
	
	afterEach(function(){
		stub.reset();
	});

	it('should call db to get all races', function(done) {
		stub.withArgs(`SELECT * 
		FROM DestinyRaceDefinition`).yields(null, standardDbResult);
		manifestDatabaseModel.getAllRaces(function(err, rows){
			expect(rows.json.something).to.equal(standardDbResult.json.something);
			done();
		});
	});

	//also needs negative tests and a spy on console
	it('should log error call db to get all races errors out', function(done) {
		stub.withArgs(`SELECT * 
		FROM DestinyRaceDefinition`).yields(standardError, null);
		manifestDatabaseModel.getAllRaces(function(err, rows){
			expect(rows).to.be.null;
			expect(err.message).to.equal(standardError.message);
			done();
		});
	});

	it('should call db to get a single race', function(done) {
		var raceId = 1;
		stub.withArgs(`SELECT * 
		FROM DestinyRaceDefinition
		WHERE id = ` + raceId).yields(null, standardDbResult);
		manifestDatabaseModel.getARace(raceId, function(err, rows){
			expect(rows.json.something).to.equal(standardDbResult.json.something);
			done();
		});
	});

	it('should call db to get a single class', function(done) {
		var classId = 1;
		stub.withArgs(`SELECT *
		FROM DestinyClassDefinition
		WHERE id = ` + classId).yields(null, standardDbResult);
		manifestDatabaseModel.getAClass(classId, function(err, rows){
			expect(rows.json.something).to.equal(standardDbResult.json.something);
			done();
		});
	});

	it('should call db to get a single gender', function(done) {
		var genderId = 1;
		stub.withArgs('SELECT * FROM DestinyGenderDefinition WHERE id = ' + genderId).yields(null, standardDbResult);
		manifestDatabaseModel.getAGender(genderId, function(err, rows){
			expect(rows.json.something).to.equal(standardDbResult.json.something);
			done();
		});
	});

	it('should call db to get list of activities', function(done) {
		var activities = {1: {}, 2: {}};
		var activityParameter = "1,2";
		stub.withArgs('SELECT * FROM DestinyActivityDefinition WHERE id IN (' + activityParameter + ')').yields(null, standardDbResult);
		manifestDatabaseModel.getActivityDetails(activities, function(err, rows){
			expect(rows.json.something).to.equal(standardDbResult.json.something);
			done();
		});
	});
});