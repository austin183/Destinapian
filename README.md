# Destinapian
A NodeJS Server and Angular App combination to explore Bungie's API for Destiny 2

# Getting Started
This ReadMe assumes you have Node installed and have access to npm.
If that is not true, please install the missing pieces from https://nodejs.org/en/

This repo does not contain the required file "../apiKey.json", which is required to be present to set the API key used to hit the Bungie API end points.  If you do not already have a key, please register for one at https://www.bungie.net/en/Application .  You must have registered with Bungie.net and logged in to get access to the App Registration page.

Create the apiKey.json file in the same directory as Destinapian, a folder up from both DestinyManifestServer and DestinySampleApp.

The contents of the file should look something like:

-------------------------------
{ 
	"apiKey": "keyFromBungie"
}
-------------------------------

This project has two components, both need the same things to get going:
1) (sudo) npm install -- This will install the necessary npm modules for components
2) npm start -- This command can be used to start the server and the angular app, depending on which folder you are in at the time.

Open a terminal or command prompt
Navigate to the Destinapian folder
Now run the following commands

cd DestinyManifestServer

(sudo) npm install

npm start

You should see some log messages indicating that the server downloaded the manifest and started listening on port 3000

Verify you can hit the end points by visiting http://localhost:3000/api-docs and choosing an end point to test.  The one that does not require any input is /Destiny2/Manifest so it is the most recommended to start with.  Others require some knowledge of the Bungie APIs.  Please see http://destinydevs.github.io/BungieNetPlatform/docs/Getting-Started for more information.


Open another terminal or command prompt
Navigate to the Destinapian folder
Now run the following commands

cd DestinySampleApp

(sudo) npm install

npm start

Verify you can use the website by visiting http://localhost:4200 .  If everything is hooked up correctly, you should see the manifest version appear a few moments after the page loads up.  That means that the angular app can talk to the server hosted on port 3000.  If you submit a Profile Name and Network type, the character drop down should load with each character's class name.  That means the server has access to the manifest database.  You are now ready to change stuff and break things!