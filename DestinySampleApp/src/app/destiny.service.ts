import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DestinyService{
	url = 'http://localhost:3000/'
	constructor(private httpClient: HttpClient){}

	public getDestiny2ProfileSearchInfo(profileName:string, membershipType:number){
		//encode the profileName string so # becomes readable
		var encodedPName = encodeURIComponent(profileName);
		return this.httpClient.get(this.url + `Destiny2/SearchDestinyPlayer/` + membershipType + `/` + encodedPName + `/`);
	}

	public getDestiny2Profile(membershipId:number, membershipType:number){
		var params = new HttpParams().set("components", "100,101,103,200,205,302,400,401,402");
		return this.httpClient.get(this.url + `Destiny2/` + membershipType + `/Profile/` + membershipId + `/`, {params:params});
	}

	public getCharacterActivityHistory(characterId:string, membershipId:number, membershipType:number, count:number, mode:number, page:number){
		var params = new HttpParams().set("count", count.toString())
		.set("mode", mode.toString())
		.set("page", page.toString());
		return this.httpClient.get(this.url + `Destiny2/` + membershipType + `/Account/` + membershipId + `/Character/` + characterId + `/Stats/Activities/`, {params: params});
	}

	public getCharacterInfo(characterId:string, membershipId:number, membershipType:number){
		var params = new HttpParams().set("components", "200,202,205");
		return this.httpClient.get(this.url + `Destiny2/` + membershipType + `/Profile/` + membershipId + `/Character/` + characterId + `/`, {params:params});
	}

  public getDestiny2Manifest(){
    return this.httpClient.get(this.url + `Destiny2/Manifest/`);
  }

}