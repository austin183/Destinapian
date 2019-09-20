//bootsrapping to provide end points and json responses
console.log("Bootstrapping Express");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const logger = require('./utilities/logger').logger;
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');
  
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//test out logging
logger.info('Testing out logging');

//configure swagger
console.log('Configuring Swagger');
logger.info('Configuring Swagger');
const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Destiny Manifest Server Docs',
      version: '1.0.0',
      description: 'Partially autogenerated doc and test interface for the Destiny Manifest Server',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./api/routes/*.js'],
};

const specs = swaggerJsdoc(options);


//update manifest if necessary
console.log("Updating Manifest");
logger.info("Updating Manifest");
var manifestModel = require('./api/models/manifestModel');
manifestModel.updateManifest();
var latestManifestPath = manifestModel.getLatestManifestDatabase();
console.log('latest manifest: ' + latestManifestPath);

//register routes
console.log("Registering routes");
logger.info("Registering routes");
var routes = require('./api/routes/manifestRoutes');
var platformRoutes = require('./api/routes/platformRoutes');
routes(app);
platformRoutes(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//start listening for requests
app.listen(port);

logger.info('Destiny Manifest RESTful API server started on: ' + port);
console.log('Destiny Manifest RESTful API server started on: ' + port);