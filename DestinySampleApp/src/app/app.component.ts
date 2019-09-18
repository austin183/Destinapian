import { Component, OnInit } from '@angular/core';
import { DestinyService } from './destiny.service';
import {DestinyEnums} from './DestinyEnums';
import {DestinyResponseHelper} from './DestinyResponseHelper';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
function translateHash(hash){
  return hash>>0;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DestinySampleApp';
  manifestVersion = '';
  getInfoForm;
  membershipId;
  characterIds;
  membershipType;
  characterRace;
  characterRaceDescription;
  characterClass;
  characterGender;
  activityList;
  membershipTypes;
  membershipTypesArray;
  gameModes;
  gameModesArray;
  characterInfoArray;
  constructor(private fb: FormBuilder, private destinyService: DestinyService, private destinyEnums: DestinyEnums, private destinyResponseHelper: DestinyResponseHelper){
    this.gameModes = destinyEnums.getDestinyGameModes();
    this.membershipTypes = destinyEnums.getMembershipTypes();
    var membershipTypesKeys = Object.keys(this.membershipTypes);
    this.membershipTypesArray = [];
    for(var i = 0, len = membershipTypesKeys.length; i< len; i++){
      var key = membershipTypesKeys[i];
      var value = this.membershipTypes[key];
      this.membershipTypesArray.push({key: key, value: value});
    }
    this.gameModesArray = [];
    var gameModeTypeKeys = Object.keys(this.gameModes);
    for(var i = 0, len = gameModeTypeKeys.length; i < len; i++){
      var key = gameModeTypeKeys[i];
      var value = this.gameModes[key];
      this.gameModesArray.push({key: key, value: value});
    }
    this.createForm();
  };
  
  createForm(){
    this.getInfoForm = this.fb.group({
      profileName: ['Naught#11555'],
      membershipTypeDropDown: ['4'],
      characterDropDown: [''],
      gameModeDropDown: [this.gameModes.AllPvP]
    });
  };

  onClickSubmit(profileName, membershipType) {
    console.log(membershipType);
    this.destinyService.getDestiny2ProfileSearchInfo(profileName, membershipType).subscribe((data:any) => {
      this.membershipId = this.destinyResponseHelper.getMembershipInfoFromProfileSeachInfo(data).membershipId;
      this.membershipType = membershipType;
      this.destinyService.getDestiny2Profile(this.membershipId, membershipType).subscribe((data:any) =>{
        this.characterIds = this.destinyResponseHelper.getCharacterInfoFromProfile(data).characterIds;
        this.getCharacterInfoArray(this.characterIds);
      });
    });
  };

  getCharacterInfoArray(characterIds){
    this.characterInfoArray = [];
    for(var i = 0, len = characterIds.length; i < len; i++){
      var characterId = characterIds[i];
      this.destinyService.getCharacterInfo(characterId, this.membershipId, this.membershipType).subscribe((data:any) =>{ 
        var info = this.destinyResponseHelper.getCharacterInfoFromCharacter(data);
        this.characterInfoArray.push(info);
        if(this.characterInfoArray.length > 0){
          this.getInfoForm.get('characterDropDown').setValue(characterId);
          this.onCharacterSelected(characterId);
        }
      });
    }
  };

  onCharacterSelected(characterId){
    this.activityList = [];
    for(var i = 0, len = this.characterInfoArray.length; i < len; i++){
      var characterInfo = this.characterInfoArray[i];
      if(characterId == characterInfo.characterId){
        this.characterClass = characterInfo.class;
        this.characterRace = characterInfo.race;
        this.characterRaceDescription = characterInfo.raceDescription;
        this.characterGender = characterInfo.gender;
        break;
      }
    }
  };

  onClickGetActivity(characterId, gameMode){
    this.destinyService.getCharacterActivityHistory(characterId, this.membershipId, this.membershipType, 25, gameMode, 0).subscribe((data:any) =>{
      console.log('character activity');
      console.log(data.Response);
      this.activityList = this.destinyResponseHelper.getCharacterActivityHistory(data, characterId);
    });
  };

  //https://appdividend.com/2019/06/07/angular-8-forms-tutorial-angular-reactive-and-template-forms-example/
  ngOnInit(){
  	this.destinyService.getDestiny2Manifest().subscribe((data:any)=>{
  		console.log(data);
      if(!!data.Response && !!data.Response.version){
        this.manifestVersion = data.Response.version;  
      }
  	})
  };
}
