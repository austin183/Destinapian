'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');

const platformRequestOptionsBuilder = rewire('../api/models/platformRequestOptionsBuilder');
const reqHeader = { apiKey: 'apiKey' };
const membershipType = 12;
const membershipId = 'abcdab';
const profileName = 'name';
let encProfileName = encodeURIComponent(profileName);
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
        var queryParams = {
            'components': 1
        };
        var allTheOptions = platformRequestOptionsBuilder.getDestiny2ProfileOptions(membershipType, membershipId, queryParams);
        expect(allTheOptions.headers.apiKey).to.equal(reqHeader.apiKey);
        expect(allTheOptions.url).to.contain('/Destiny2/' + membershipType + '/Profile/' + membershipId + '/');
        expect(allTheOptions.qs.components).to.equal(queryParams.components);
        done();
    });
});