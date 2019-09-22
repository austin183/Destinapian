'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const manifestModel = rewire('../api/models/manifestModel');
const stubbedPlatformOptionsBuilder = require('../api/models/platformRequestOptionsBuilder');
const stubbedRequest = require('request');
const stubbedFs = require('fs');
const logger = require('../utilities/logger').logger;

const standardError = {message: 'hi there'};
const standardConentFileName = {
    fileName: 'testFileName',
    contnetPath: 'testContnetPath'
};

describe('manifestModel should getLatestManifestDatabase file from contents directory', function(){
    var loggerErrorSpy;
    var loggerInfoSpy;
    var platformStub = sinon.stub(stubbedPlatformOptionsBuilder, "getDestiny2ManifestOptions");
    var requestStub = sinon.stub(stubbedRequest, "get");
    beforeEach(function(){
        loggerErrorSpy = sinon.spy(logger, "error");
        loggerInfoSpy = sinon.spy(logger, "info");
        manifestModel.__set__("getLogger", function(){
			return logger;
        });
        manifestModel.__set__("getRequest", function(){
            return stubbedRequest;
        });
        manifestModel.__set__("getPlatformOptionsBuilder", function(){
            return stubbedPlatformOptionsBuilder;
        });
        manifestModel.__set__("getContentFileName", function(jData){
            return {
                fileName: "fileName",
                currentContentPath: "path"
            };
        });

        manifestModel.__set__("downloadContent", function(){
            //ToDo expect or assert something here
            return;
        });
    });

    afterEach(function(){
        platformStub.reset();
        requestStub.reset();
        loggerErrorSpy.restore();
        loggerInfoSpy.restore();
	});

    it('should updateManifest with the from the internet', function(done){
        var options = { stubbed: 'options'};
        var innerBody = { inner: 'body' };
        var requestBody = JSON.stringify(innerBody);

        platformStub.returns(options);
        requestStub.withArgs(options).yields(null, null, requestBody);

        manifestModel.updateManifest();
        expect(loggerInfoSpy.withArgs("Ready to check update").calledOnce).to.be.true;
        //Todo - fille out expectations
        done();
    });
});