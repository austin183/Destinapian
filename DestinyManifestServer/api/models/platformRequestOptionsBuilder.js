'use strict';

const fs = require('fs');

let apiFile = fs.readFileSync('../../apiKey.json');
let apiKeyHolder = JSON.parse(apiFile);
const platformUrl = 'https://www.bungie.net/Platform/';

let reqHeader = { 'X-API-KEY' : apiKeyHolder.apiKey };
const respHeader = {'Access-Control-Allow-Origin': 'http://localhost:4200',
'Content-Type':'application/json'};

exports.getDestiny2ProfileSearchOptions = function(membershipType, profileName){
	var encProfileName = encodeURIComponent(profileName);
	var options = {
		url: platformUrl + '/Destiny2/SearchDestinyPlayer/' + membershipType + '/' + encProfileName + '/',
		headers: reqHeader
	}
	return options;
}

exports.getDestiny2ProfileOptions = function(membershipType, membershipId, queryParams){
	var options = {
		url: platformUrl + '/Destiny2/' + membershipType + '/Profile/' + membershipId + '/',
		headers: reqHeader,
		qs: queryParams
	}
	return options;
};

exports.getCharacterActivityHistoryOptions = function(membershipType, membershipId, characterId, queryParams){
	var options = {
		url: platformUrl + `Destiny2/` + membershipType + `/Account/` + membershipId + `/Character/` + characterId + `/Stats/Activities/`,
		headers: reqHeader,
		qs: queryParams
	}
	return options;
};

exports.getCharacterInfoOptions = function(membershipType, membershipId, characterId, queryParams){
	var options = {
		url: platformUrl + `Destiny2/` + membershipType + `/Profile/` + membershipId + `/Character/` + characterId + `/`,
		headers: reqHeader,
		qs: queryParams
	}
	return options;
};

exports.getDestiny2ManifestOptions = function(){
	var options = {
		url: platformUrl + `Destiny2/Manifest/`,
		headers: reqHeader
	}
	return options;
};

exports.getPostGameCarnageReportOptions = function(activityId){
	var options = {
		url: platformUrl + 'Destiny2/Stats/PostGameCarnageReport/' + activityId + '/',
		headers: reqHeader
	};
	return options;
}

