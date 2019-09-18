'use strict';

const path = require('path');
const fs = require('fs');
const request = require('request');
const zlib = require('zlib');
const unzipper = require('unzipper');
const platformOptionsBuilder = require('../models/platformRequestOptionsBuilder');
const contentsPathComponent = "./contents";
if (!fs.existsSync(contentsPathComponent)){
    fs.mkdirSync(contentsPathComponent);
}

function getContentFileName(jData){
	var currentContentPath = jData.Response.mobileWorldContentPaths.en;
	var fileName = path.basename(currentContentPath);
	return {
		fileName: fileName,
		contentPath: currentContentPath
	}
};

function downloadContent(path, fileName){
	if(!fs.existsSync('./' + fileName + '.zip')){
		var file = fs.createWriteStream(fileName + '.zip');
		let stream = request({
			/* Here you should specify the exact link to the file you are trying to download */
			uri: 'http://www.bungie.net' + path,
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
				'Accept-Encoding': 'gzip, deflate',
				'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
				'Cache-Control': 'max-age=0',
				'Connection': 'keep-alive',
				'Upgrade-Insecure-Requests': '1',
				'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
			},
			/* GZIP true for most of the websites now, disable it if you don't need it */
			gzip: false
			})
			.pipe(file)
			.on('finish', () => {
				console.log(`The file is finished downloading.  Performing extraction`);
				extractFileContents(fileName);
			})
			.on('error', (error) => {
				console.log(error);
			});	
	}
	else{
		console.log(`The file already here.  Performing extraction`);
		extractFileContents(fileName);
	}
	
};

function extractFileContents(fileName){
	var readContents = fs.createReadStream('./' + fileName + '.zip');
	readContents.pipe(unzipper.Extract({path: contentsPathComponent} ));
};

exports.updateManifest = function(){
	var options = platformOptionsBuilder.getDestiny2ManifestOptions();
	request(options, (err, resp, body) => {
		console.log("Ready to check update");
		var jData = JSON.parse(body);
		var fileInfo = getContentFileName(jData);
		if(!fs.existsSync('./contents/' + fileInfo.fileName)){
			console.log('Downloading from bungie.net ' + fileInfo.fileName);
			downloadContent(fileInfo.contentPath, fileInfo.fileName);
		}
		else{
			console.log('Exists: ' + fileInfo.fileName);	
		}
		
	});
};

exports.getLatestManifestDatabase = function(){
	var latestCreateTime = '';
	var filePath = '';
	var list = fs.readdirSync(contentsPathComponent + "/");
	list.forEach(function(file){
		var stats = fs.statSync(contentsPathComponent + "/" + file);
		if(file.includes('.content')){
		}
		if((latestCreateTime == '' || latestCreateTime < stats.ctime) 
			&& file.includes('.content')){
			filePath = contentsPathComponent + "/" + file;
			latestCreateTime = stats.ctime;
		}
	});
	return filePath;
};