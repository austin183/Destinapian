'use strict';

const rewire = require('rewire');
const manifestDatabaseModel = rewire('../api/models/manifestDatabaseModel');
const expect = require('chai').expect;
const sinon = require('sinon');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(":memory:");
beforeEach(function(){
	manifestDatabaseModel.__set__("getDatabase", function(){
		return db;
	});
});

describe('Manifest Database Model', function() {

	it('should call db to get all races', function(done) {
		var stub = sinon.stub(db, "all")
			.yields(null, {id: 1, 
				json: JSON.stringify({something: 'hello'})
			});
		manifestDatabaseModel.getAllRaces(function(err, rows){
			stub.restore();
			done();
		});
	});
});