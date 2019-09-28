'use strict';
const rewire = require('rewire');
const manifestController = rewire('../api/controllers/manifestController');
const manifestDatabaseModel = require('../api/models/manifestDatabaseModel');
const expect = require('chai').expect;
const sinon = require('sinon');
const logger = require('../utilities/logger').logger;

describe('Manifest Controller', function(){
    var manifestDatabaseModelStub;
    var loggerSpy;
    beforeEach(function(){
        loggerSpy = sinon.spy(logger, "error");
        manifestDatabaseModelStub = sinon.stub(manifestDatabaseModel, "getAllRaces");
        manifestController.__set__("getLogger", function(){
            return logger;
        });
    });

    afterEach(function(){
        manifestDatabaseModelStub.restore();
        loggerSpy.restore();
    });

    it('should get all races', function(done){
        manifestDatabaseModelStub.yields(null, [{something: 1}, {something: 2}]);
        var req = {
            params: { raceId: 1 }
        };
        var res = {
            json: function(rows){
                expect(rows).to.not.be.null;
                expect(rows.length).to.equal(2);
                done();
            }
        }
        manifestController.get_all_races(req, res);
    });

    it('should log error if getAllRaces returns error', function(done){
        var error = {message: 'error'};
        manifestDatabaseModelStub.yields(error, null);
        var req = {
            params: { raceId: 1 }
        };
        var res = {
            json: function(err){
                expect(err.message).to.equal(error.message);
                expect(loggerSpy.withArgs(error.message).calledOnce).to.be.true;
                done();
            }
        }
        manifestController.get_all_races(req, res);
    });
});