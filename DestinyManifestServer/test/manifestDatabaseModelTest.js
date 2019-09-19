'use strict';

const rewire = require('rewire');
const manifestDatabaseModel = rewire('../api/models/manifestDatabaseModel');
const expect = require('chai').expect;
const sinon = require('sinon');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(":memory:");
var stub;
var standardDbResult = {id: 1, 
	json: {something: 'hello'}
};

describe('Manifest Database Model', function() {
	stub = sinon.stub(db, "all");
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
});