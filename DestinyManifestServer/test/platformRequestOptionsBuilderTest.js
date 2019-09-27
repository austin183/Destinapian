'use strict';

const expect = require('chai').expect;
const rewire = require('rewire');

const platformRequestOptionsBuilder = rewire('../api/models/platformRequestOptionsBuilder');
const reqHeader = { apiKey: 'apiKey' };
describe('platformRequestOptionsBuilder', function(){
    beforeEach(function(){
        platformRequestOptionsBuilder.__set__("getRequestHeader", function(){
            return reqHeader;
        });
    });

    afterEach(function(){
    });

    it('should getDestiny2ProfileSearchOptions by parameters', function(done){
        var membershipType = 12;
        var profileName = 'name';
        var allTheOptions = platformRequestOptionsBuilder.getDestiny2ProfileSearchOptions(membershipType, profileName);
        expect(allTheOptions.headers.apiKey).to.equal(reqHeader.apiKey);
        console.log(allTheOptions);
        done();
    });
});