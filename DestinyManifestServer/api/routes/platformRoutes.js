'use strict';

module.exports = function(app){
	var platform = require('../controllers/platformController');

	/**
	 * @swagger
	 *
	 * /Destiny2/Manifest:
	 *   get:
	 *     description: Get manifest definition
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Membership Info
 	*/
	app.route('/Destiny2/Manifest')
		.get(platform.get_destiny2_manifest);
	
	/**
	 * @swagger
	 *
	 * /Destiny2/SearchDestinyPlayer/{membershipType}/{profileName}:
	 *   get:
	 *     description: Get membership info by profile name
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: membershipType
	 *         description: PSN, XBox, Blizzard, etc...
	 *         in: path
	 *         required: true
	 *         type: string
	 *       - name: profileName
	 *         description: profileName (with #id for Blizzard)
	 *         in: path
	 *         required: true
	 *         type: string
	 *     responses:
	 *       200:
	 *         description: Membership Info
 	*/
	app.route('/Destiny2/SearchDestinyPlayer/:membershipType/:profileName/')
		.get(platform.get_destiny2_profile_search);


	/**
	 * @swagger
	 *
	 * /Destiny2/{membershipType}/Profile/{membershipId}:
	 *   get:
	 *     description: Get membership info by profile name
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: membershipType
	 *         description: PSN, XBox, Blizzard, etc...
	 *         in: path
	 *         required: true
	 *         type: string
	 *       - name: membershipId
	 *         description: membershipId (as seen in results from SearchDestinyPlayer)
	 *         in: path
	 *         required: true
	 *         type: string
	 *       - name: components
	 *         in: query
	 *         type: string
	 *         description: what info to pull back (try '100,101,103,200,205,302,400,401,402')
	 *     responses:
	 *       200:
	 *         description: Membership Profile Info with character info
 	*/
	app.route('/Destiny2/:membershipType/Profile/:membershipId/')
		.get(platform.get_destiny2_profile);

	/**
	 * @swagger
	 *
	 /Destiny2/{membershipType}/Profile/{membershipId}/Character/{characterId}/:
	 *   get:
	 *     description: Get character info
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: membershipType
	 *         description: PSN, XBox, Blizzard, etc...
	 *         in: path
	 *         required: true
	 *         type: string
	 *       - name: membershipId
	 *         description: membershipId (as seen in results from SearchDestinyPlayer)
	 *         in: path
	 *         required: true
	 *         type: string
	 *       - name: characterId
	 *         description: characterId (as seen in results from Membership Profile info)
	 *         in: path
	 *         required: true
	 *         type: string
 	 *       - name: components
	 *         in: query
	 *         type: string
	 *         description: what info to pull back (try '200,202,205')
	 *     responses:
	 *       200:
	 *         description: Membership Profile Info with character info
 	*/
	app.route('/Destiny2/:membershipType/Profile/:membershipId/Character/:characterId/')
		.get(platform.get_character_info);


	/**
	 * @swagger
	 *
	 * /Destiny2/{membershipType}/Account/{membershipId}/Character/{characterId}/Stats/Activities/:
	 *   get:
	 *     description: Get activities by character and game mode
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - name: membershipType
	 *         description: PSN, XBox, Blizzard, etc...
	 *         in: path
	 *         required: true
	 *         type: string
	 *       - name: membershipId
	 *         description: membershipId (as seen in results from SearchDestinyPlayer)
	 *         in: path
	 *         required: true
	 *         type: string
	 *       - name: characterId
	 *         description: characterId (as seen in results from Membership Profile info)
	 *         in: path
	 *         required: true
	 *         type: string
	 *       - name: count
	 *         in: query
	 *         type: int
	 *         description: number of activities to return (please keep below 100)
	 *       - name: mode
	 *         in: query
	 *         type: int
	 *         description: type of activities to return (try 5 for allPvP)
	 *       - name: page
	 *         in: query
	 *         type: int
	 *         description: where to start getting activities (if count is 20 and page is 2, it should return records 20 thru)
	 *     responses:
	 *       200:
	 *         description: Membership Profile Info with character info
 	*/
	app.route('/Destiny2/:membershipType/Account/:membershipId/Character/:characterId/Stats/Activities/')
		.get(platform.get_character_activity_history);

	/**
	 * @swagger
	 *
	 * /Destiny2/Stats/PostGameCarnageReport/{activityId}:
	 *   get:
	 *     description: Get manifest definition
 	 *     parameters:
	 *       - name: activityId
	 *         description: ActivityId for the post game carnage report (get from activities as instanceId)
	 *         in: path
	 *         required: true
	 *         type: string
	 *     produces:
	 *       - application/json
	 *     responses:
	 *       200:
	 *         description: Membership Info
 	*/
	app.route('/Destiny2/Stats/PostGameCarnageReport/:activityId')
		.get(platform.get_post_game_carnage_report);
};