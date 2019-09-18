'use strict';

const manifestDatabaseModel = require('../models/manifestDatabaseModel');


exports.get_all_races = function(req, res) {
	manifestDatabaseModel.getAllRaces(function(err, rows){
		res.json(rows);
	});
};

exports.get_a_race = function(req, res){
	manifestDatabaseModel.getARace(req.params.raceId, function(err, rows){
		res.json(rows);
	});
};