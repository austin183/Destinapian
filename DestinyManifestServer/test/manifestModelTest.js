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
const standardContent = {
    fileName: 'testFileName',
    contnetPath: 'testContnetPath'
};
const innerBody = { inner: 'body' };

describe('manifestModel should getLatestManifestDatabase file from contents directory', function(){
    var loggerErrorSpy;
    var loggerInfoSpy;
    var platformStub = sinon.stub(stubbedPlatformOptionsBuilder, "getDestiny2ManifestOptions");
    var requestStub = sinon.stub(stubbedRequest, "get");
    var flExistsSyncStub = sinon.stub(stubbedFs, "existsSync");
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
            expect(jData.inner).to.equal(innerBody.inner);
            return standardContent;
        });

        manifestModel.__set__("downloadContent", function(contentPath, fileName){
            expect(contentPath).to.equal(standardContent.contentPath);
            expect(fileName).to.equal(standardContent.fileName);
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
        var requestBody = JSON.stringify(innerBody);

        platformStub.returns(options);
        requestStub.withArgs(options).yields(null, null, requestBody);
        flExistsSyncStub.withArgs('./contents/' + standardContent.fileName).returns(false);

        manifestModel.updateManifest();
        expect(loggerInfoSpy.withArgs("Ready to check update").calledOnce).to.be.true;
        expect(loggerInfoSpy.withArgs("Downloading from bungie.net " + standardContent.fileName).calledOnce).to.be.true;
        //Todo - fill out expectations and refactor, to getLatestManifestDatabase test
        done();
    });
});