'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');

const platformRequestOptionsBuilder = rewire('../api/models/platformRequestOptionsBuilder');
const reqHeader = { apiKey: 'apiKey' };
const membershipType = 12;
const membershipId = 'abcdab';
const characterId = 'alskdfj';
const profileName = 'name';
const activityId = 'activityId';
let encProfileName = encodeURIComponent(profileName);
const queryParams = {
    'components': 1
};
describe('platformRequestOptionsBuilder', function(){

    beforeEach(function(){
        platformRequestOptionsBuilder.__set__("getRequestHeader", function(){
            return reqHeader;
        });
    });

    afterEach(function(){
    });

    it('should getDestiny2ProfileSearchOptions by parameters', function(done){
        var allTheOptions = platformRequestOptionsBuilder.getDestiny2ProfileSearchOptions(membershipType, profileName);
        expect(allTheOptions.headers.apiKey).to.equal(reqHeader.apiKey);
        expect(allTheOptions.url).to.contain('/Destiny2/SearchDestinyPlayer/' + membershipType + '/' + encProfileName + '/');
        done();
    });

    it('should getDestiny2ProfileOptions by parameters', function(done){
        var allTheOptions = platformRequestOptionsBuilder.getDestiny2ProfileOptions(membershipType, membershipId, queryParams);
        expect(allTheOptions.headers.apiKey).to.equal(reqHeader.apiKey);
        expect(allTheOptions.url).to.contain('/Destiny2/' + membershipType + '/Profile/' + membershipId + '/');
        expect(allTheOptions.qs.components).to.equal(queryParams.components);
        done();
    });

    it('should getCharacterActivityHistoryOptions by parameters', function(done){
        var allTheOptions = platformRequestOptionsBuilder.getCharacterActivityHistoryOptions(membershipType, membershipId, characterId, queryParams);
        expect(allTheOptions.headers.apiKey).to.equal(reqHeader.apiKey);
        expect(allTheOptions.url).to.contain(`/Destiny2/` + membershipType + `/Account/` + membershipId + `/Character/` + characterId + `/Stats/Activities/`);
        expect(allTheOptions.qs.components).to.equal(queryParams.components);
        done();
    });

    it('should getCharacterInfoOptions by parameters', function(done){
        var allTheOptions = platformRequestOptionsBuilder.getCharacterInfoOptions(membershipType, membershipId, characterId, queryParams);
        expect(allTheOptions.headers.apiKey).to.equal(reqHeader.apiKey);
        expect(allTheOptions.url).to.contain(`/Destiny2/` + membershipType + `/Profile/` + membershipId + `/Character/` + characterId + `/`);
        expect(allTheOptions.qs.components).to.equal(queryParams.components);
        done();
    });

    it('should getDestiny2ManifestOptions by parameters', function(done){
        var allTheOptions = platformRequestOptionsBuilder.getDestiny2ManifestOptions();
        expect(allTheOptions.headers.apiKey).to.equal(reqHeader.apiKey);
        expect(allTheOptions.url).to.contain(`Destiny2/Manifest/`);
        done();
    });

    it('should getPostGameCarnageReportOptions by parameters', function(done){
        var allTheOptions = platformRequestOptionsBuilder.getPostGameCarnageReportOptions(activityId);
        expect(allTheOptions.headers.apiKey).to.equal(reqHeader.apiKey);
        expect(allTheOptions.url).to.contain('Destiny2/Stats/PostGameCarnageReport/' + activityId + '/');
        done();
    });
});