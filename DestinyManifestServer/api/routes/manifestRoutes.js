'use strict';

module.exports = function(app){
	var manifest = require('../controllers/manifestController');
	
	/**
	 * @swagger
	 *
	 * /races/:
	 *   get:
	 *     description: Get membership info by profile name
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Membership Info
 	*/
	app.route('/races')
		.get(manifest.get_all_races);

	/**
	 * @swagger
	 *
	 * /races/{raceId}:
	 *   get:
	 *     description: Get membership info by profile name
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: raceId
	 *         description: hash of a race (like 2803282938)
	 *         in: path
	 *         required: true
	 *         type: string
	 *     responses:
	 *       200:
	 *         description: Membership Info
 	*/
	app.route('/races/:raceId')
		.get(manifest.get_a_race);
};