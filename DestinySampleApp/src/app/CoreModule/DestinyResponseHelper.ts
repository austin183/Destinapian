import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DestinyResponseHelper{

	constructor(){};

	public getMembershipInfoFromProfileSeachInfo(data){
		var membershipInfo = {
			membershipId : data.Response[0].membershipId
		};
		return membershipInfo;
	}

	public getCharacterInfoFromProfile(data){
		var characterInfo = {
			characterIds: data.Response.profile.data.characterIds
		}
		return characterInfo;
	}

	public getCharacterInfoFromCharacter(data){
		var characterInfo = {
			class : data.Response.manifestAddendum.classInfo.displayProperties.name,
			race: data.Response.manifestAddendum.raceInfo.displayProperties.name,
			raceDescription: data.Response.manifestAddendum.raceInfo.displayProperties.description,
			gender: data.Response.manifestAddendum.genderInfo.displayProperties.name,
			characterId: data.Response.character.data.characterId
		};
		return characterInfo;
	}

	public getCharacterActivityHistory(data, characterId){
		var activityHistory = this.assembleActivityRecords(data, characterId);

		return activityHistory;
	}

	private assembleActivityRecords(data, characterId){
		var activities = data.Response.activities;
		var activityList = [];
		for(var i = 0, len = activities.length; i < len; i++){
			var activity = activities[i];
	        var activityHash = this.translateHash(activity.activityDetails.directorActivityHash);
	        var activityManifestInfo = data.Response.manifestAddendum.activityInfo[activityHash];
	        var instanceId = activity.activityDetails.instanceId;
	        var postGameCarnageReport = data.Response.platformAddendum.postGameCarnageReport[instanceId].Response;
	        var reportInfo = this.assemblePostGameCarnageReportInfo(data, postGameCarnageReport, characterId);
	        activityList.push({
				period : activity.period,
				name: activityManifestInfo.displayProperties.name,
				efficiency: activity.values.efficiency.basic.value,
				standing: reportInfo.standing
	        });
		}
		return activityList;
	}

	private assemblePostGameCarnageReportInfo(data, postGameCarnageReport, characterId){
		var reportInfo = { 
			standing: ''
		};
		for(var i = 0, postLen = postGameCarnageReport.entries.length; i < postLen; i++){
			var entry = postGameCarnageReport.entries[i];
			var standing = '';
			if(entry.characterId == characterId){
				standing = entry.standing;
				reportInfo.standing = this.getStandingValue(postGameCarnageReport, standing);
				break;
			}
		}
		return reportInfo;
	}

	private getStandingValue(postGameCarnageReport, standing){
		for(var i = 0, teamsLen = postGameCarnageReport.teams.length; i < teamsLen; i++){
			var team = postGameCarnageReport.teams[i];
			if(team.standing.basic.value == standing){
				return team.standing.basic.displayValue;
			}
		}
	}

	private translateHash(hash){
		return hash>>0;
	}
}