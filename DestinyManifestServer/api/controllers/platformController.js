'use strict';

const platformOptionsBuilder = require('../models/platformRequestOptionsBuilder');
const manifestAddendumBuilder = require('../models/manifestAddendumBuilder');
const platformAddendumBuilder = require('../models/platformAddendumBuilder');
const objectHash = require('object-hash');
const cache = require('../models/cacheModel');
const request = require('request');
const respHeader = {'Access-Control-Allow-Origin': 'http://localhost:4200',
'Content-Type':'application/json'};
let defaultManifestAddendumFunction = function(result, resolve, reject){ 
	resolve();
};

function makeRequest(options, res, manifestAddendumFunction, cacheType, cacheAddress){
	request.get(options, (err, resp, body) =>{
	    res.header(respHeader);
	    var result = JSON.parse(body);
	    new Promise(function(resolve, reject){
	    	manifestAddendumFunction(result, resolve, reject);
	    }).then(function(){
	    	cache.setCachedValue(cacheType, cacheAddress, result);
	    	res.json(result);
	    });
	});
};

function respondWithCachedValue(res, cachedValue){
	res.header(respHeader);
	res.json(cachedValue);
};

function tryToRespondFromCache(res, type, cacheAddress){
	var cachedValue = cache.getCachedValue(type, cacheAddress);
	if(cachedValue !== undefined && cachedValue != ''){
		respondWithCachedValue(res, cachedValue);
		return true;
	}
	return false;
};

exports.get_destiny2_profile_search = function(req, res){
	var cacheAddress = req.params.membershipType + '~~' + req.params.profileName;
	var type="profileSearch";
	if(tryToRespondFromCache(res, type, cacheAddress)){
		return;
	}
	var options = platformOptionsBuilder.getDestiny2ProfileSearchOptions(req.params.membershipType, req.params.profileName);
	makeRequest(options, res, defaultManifestAddendumFunction, type, cacheAddress);
};

exports.get_destiny2_profile = function(req, res){
	var cacheAddress = req.params.membershipType + '~~' + req.params.profileName + '~~' + objectHash(req.query);
	var type = 'profile';
	if(tryToRespondFromCache(res, type, cacheAddress)){
		return;
	}
	var options = platformOptionsBuilder.getDestiny2ProfileOptions(req.params.membershipType, req.params.membershipId, req.query);
	makeRequest(options, res, defaultManifestAddendumFunction, type, cacheAddress);
};

exports.get_character_activity_history = function(req, res){
	var type = "activityHistory";
	var cacheAddress = req.params.membershipType + '~~' + req.params.membershipId + '~~' + req.params.characterId + '~~' + objectHash(req.query);
	if(tryToRespondFromCache(res, type, cacheAddress)){
		return;
	}
	var options = platformOptionsBuilder.getCharacterActivityHistoryOptions(req.params.membershipType, req.params.membershipId, req.params.characterId, req.query);
	var manifestAddendumFunction = function(result, resolve, reject){
		var promises = [];
		result.Response.manifestAddendum = {};
		promises.push(manifestAddendumBuilder.buildActivityInfoAddendum(result));
		promises.push(platformAddendumBuilder.buildPostGameCarnageReport(result));

		Promise.all(promises).then(function(){
			resolve();
		});
	};
	makeRequest(options, res, manifestAddendumFunction, type, cacheAddress);
};

exports.get_character_info = function(req, res){
	var type="characterInfo";
	var cacheAddress = req.params.membershipType + '~~' + req.params.membershipId + '~~' + req.params.characterId + '~~' + objectHash(req.query);
	if(tryToRespondFromCache(res, type, cacheAddress)){
		return;
	}
	var options = platformOptionsBuilder.getCharacterInfoOptions(req.params.membershipType, req.params.membershipId, req.params.characterId, req.query);
	var manifestAddendumFunction = function(result, resolve, reject){
		var promises = [];
		result.Response.manifestAddendum = {};
		
		promises.push(manifestAddendumBuilder.buildRaceInfoAddendum(result));
		promises.push(manifestAddendumBuilder.buildClassInfoAddendum(result));
		promises.push(manifestAddendumBuilder.buildGenderInfoAddendum(result));

		Promise.all(promises).then(function(){
			resolve();
		});
	};
	makeRequest(options, res, manifestAddendumFunction, type, cacheAddress);
};

exports.get_destiny2_manifest = function(req, res){
	var options = platformOptionsBuilder.getDestiny2ManifestOptions();
	makeRequest(options, res, defaultManifestAddendumFunction);
};

exports.get_post_game_carnage_report = function(req, res){
	var type="postGameCarnageReport";
	var cacheAddress = req.params.activityId;
		if(tryToRespondFromCache(res, type, cacheAddress)){
		return;
	}
	var options = platformOptionsBuilder.getPostGameCarnageReportOptions(req.params.activityId);
	makeRequest(options, res, defaultManifestAddendumFunction, type, cacheAddress);
};


