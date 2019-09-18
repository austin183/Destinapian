'use strict';

const sqlite3 = require('sqlite3').verbose();
const manifest = require('./manifestModel');
let databasePath = getInitialDatabasePath();
let db = new sqlite3.Database(databasePath, 
	sqlite3.OPEN_READONLY, (err) => {
	if(err){
		return console.error(err.message);
	}
	console.log('Connected to the contents database');
});

function getInitialDatabasePath(){
	return manifest.getLatestManifestDatabase();
};

exports.getAllRaces = function(callback){
	db.all(
		`SELECT * 
		FROM DestinyRaceDefinition`, (err, rows) =>{
		if(err){
			console.error(err.message);
		}
		callback(err, rows);
	});
};

exports.getARace = function(raceId, callback){
	db.all(
		`SELECT * 
		FROM DestinyRaceDefinition
		WHERE id = ` + raceId + ``, (err, rows) =>{
		if(err){
			console.error(err.message);
		}
		callback(err, rows);
	});
};

exports.getAClass = function(classId, callback){
	db.all(`SELECT *
		FROM DestinyClassDefinition
		WHERE id = ` + classId, (err, rows) =>{
		if(err){
			console.error(err.message);
		}
		callback(err, rows);
	});
};

exports.getAGender = function(genderId, callback){
	db.all('SELECT * FROM DestinyGenderDefinition WHERE id = ' + genderId, (err, rows) => {
		if(err){
			console.error(err.message);
		}
		callback(err, rows);
	});
};

exports.getActivityDetails = function(activitiesToRetrieve, callback){
	var activityArray = Object.keys(activitiesToRetrieve);
	var activityParameter = activityArray.join(',');
	db.all('SELECT * FROM DestinyActivityDefinition WHERE id IN (' + activityParameter + ')', (err, rows) => {
		if(err){
			console.error(err.message);
		}
		callback(err, rows);
	});
};

