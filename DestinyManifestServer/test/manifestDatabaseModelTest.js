'use strict';

const manifestDatabaseModel = require('../api/models/manifestDatabaseModel');
const expect = require('chai').expect;
const sinon = require('sinon');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(":memory:");
const mock = sinon.mock(db);

describe('Manifest Database Model', function() {
	it('should call db to get all races', function(done) {
		manifestDatabaseModel.getAllRaces(function(err, rows){
			mock.expects("all").once();
		});
		done();
	});
});