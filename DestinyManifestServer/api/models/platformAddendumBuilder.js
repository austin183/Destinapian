'use strict';

const platformOptionsBuilder = require('../models/platformRequestOptionsBuilder');
const request = require('request');
const cache = require('../models/cacheModel');

function generatePostGameCarnageReportPromises(result){
	let postGamePromises = [];
	for(var i = 0, len = result.Response.activities.length; i < len; i++){
		postGamePromises.push(
			generatePostGameCarnageReportPromise(result, i)
		);
	}
	return postGamePromises;
}

function generatePostGameCarnageReportPromise(result, i){
	var cacheType = 'PostGameCarnageReport';
	return new Promise((resolve, reject) =>{
		var activity = result.Response.activities[i];
		var instanceId = activity.activityDetails.instanceId;
		var cachedValue = cache.getCachedValue(cacheType, instanceId);
		if(cachedValue !== undefined && cachedValue != ''){
			result.Response.platformAddendum.postGameCarnageReport[instanceId] = cachedValue;
			resolve();
			return;
		}
		getPostGameCarnageReportFromRequest(result, cacheType, instanceId, resolve);
	});
}

function getPostGameCarnageReportFromRequest(result, cacheType, instanceId, resolve){
	var options = platformOptionsBuilder.getPostGameCarnageReportOptions(instanceId);
	request.get(options, (err, resp, body) =>{
		var value = JSON.parse(body);
		cache.setCachedValue(cacheType, instanceId, value);
		result.Response.platformAddendum.postGameCarnageReport[instanceId] = value;
		resolve();
	});
}

exports.buildPostGameCarnageReport = function(result){
	return new Promise((resolve, reject) =>{
		result.Response.platformAddendum = {};
		result.Response.platformAddendum.postGameCarnageReport = {};
		let postGamePromises = generatePostGameCarnageReportPromises(result)
		Promise.all(postGamePromises).then(function(){
			resolve()
		});
	});
};