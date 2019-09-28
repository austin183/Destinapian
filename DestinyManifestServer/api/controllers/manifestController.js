'use strict';

const manifestDatabaseModel = require('../models/manifestDatabaseModel');
const logger = require('../../utilities/logger').logger;

function getLogger(){
	return logger;
};


exports.get_all_races = function(req, res) {
	manifestDatabaseModel.getAllRaces(function(err, rows){
		if(err){
			getLogger().error(err.message);
			res.json(err);
			return;
		}
		res.json(rows);
	});
};

exports.get_a_race = function(req, res){
	manifestDatabaseModel.getARace(req.params.raceId, function(err, rows){
		if(err){
			getLogger().error(err.message);
			res.json(err);
			return;
		}
		res.json(rows);
	});
};