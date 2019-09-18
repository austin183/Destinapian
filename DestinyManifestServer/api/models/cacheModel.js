'use strict';

var cache = {};

exports.getCachedValue = function(type, address){
	var value = '';
	if(cache.hasOwnProperty(type)){
		if(cache[type].hasOwnProperty(address)){
			value = cache[type][address];
		}
	}
	return value;
};

exports.setCachedValue = function(type, address, value){
	if(!cache.hasOwnProperty(type)){
		cache[type] = {};
	}
	cache[type][address] = value;	
};