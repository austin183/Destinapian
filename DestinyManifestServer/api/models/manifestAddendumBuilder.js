'use strict';

const manifestDatabaseModel = require('../models/manifestDatabaseModel');
const utilityModel = require('./utilityModel');

function translateHash(hash){
	return utilityModel.translateHash(hash);
};

function handleError(err, reject){
	if(err){
		console.error(err);
		reject();
	}
};

exports.buildRaceInfoAddendum = function(result){
	return new Promise(function(resolve, reject){
		manifestDatabaseModel.getARace(translateHash(result.Response.character.data.raceHash), function(err, rows){
			handleError(err, reject);
			result.Response.manifestAddendum.raceInfo = JSON.parse(rows[0].json);
			resolve();
		});
	});
};

exports.buildClassInfoAddendum = function(result){
	return new Promise(function(resolve, reject){
		manifestDatabaseModel.getAClass(translateHash(result.Response.character.data.classHash), function(err, rows){
			handleError(err, reject);
			result.Response.manifestAddendum.classInfo = JSON.parse(rows[0].json);
			resolve();
		});
	});
};

exports.buildGenderInfoAddendum = function(result){
	return new Promise(function(resolve, reject){
		manifestDatabaseModel.getAGender(translateHash(result.Response.character.data.genderHash), function(err, rows){
			handleError(err, reject);
			result.Response.manifestAddendum.genderInfo = JSON.parse(rows[0].json);
			resolve();
		});
	});
};

exports.buildActivityInfoAddendum = function(result){
	return new Promise(function(resolve, reject){
		var activitiesToRetrieve = {};
		for(var i = 0, len = result.Response.activities.length; i < len; i++){
			var activity = result.Response.activities[i];
			var translatedHash = translateHash(activity.activityDetails.directorActivityHash);
			if(!activitiesToRetrieve.hasOwnProperty(translatedHash)){
				activitiesToRetrieve[translatedHash] = {};
			}
		}
		manifestDatabaseModel.getActivityDetails(activitiesToRetrieve, function(err, rows){
			handleError(err, reject);
			result.Response.manifestAddendum.activityInfo = activitiesToRetrieve;
			for(var i = 0, len = rows.length; i < len; i++){
				result.Response.manifestAddendum.activityInfo[rows[i].id] = JSON.parse(rows[i].json);
			}
			resolve();
		});
	});	
};