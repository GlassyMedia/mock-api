#!/usr/bin/env node
'use strict';
var events = require('events');
var eventEmitter = new events.EventEmitter();

var fs = require('fs');
var chalk = require('chalk');
var express = require('express');

var generateJsonSchema = require('json-schema-random');

var MOCK_CONFIG = {
  configFile: 'mock.json',
};

function onErr(err){
  // Generic error handling
  log(err, 'red');
  return 1;
}

function log(string, color){
  console.log(color ? chalk[color](string) : string);
}

function readConfig(){
  // Parse mock.json configuration file
  var config = JSON.parse(fs.readFileSync(MOCK_CONFIG.configFile, 'utf8'));
  eventEmitter.emit('parsedConfig', config);
}

function generateFromSchema (schemaPath) {
  var schema = fs.readFileSync(schemaPath, 'utf8');
  var randNum = parseInt(Math.random()*20, 10);
  return Array.apply(null, Array(randNum))
    .map(function(){
      return generateJsonSchema(JSON.parse(schema));
    });
}

function makeAPI(config){
  var app = express();
  var schemaRoot = config.schemasPath
  log('Creating resources:', 'green');

  config.resources.forEach( function(resource){
    var dummyData = generateFromSchema(schemaRoot+resource.schema);
    var verb = resource.verb.toLowerCase();

    app[verb](resource.resourcePath, function(req, res){
      res.json(dummyData);
    });

    log(resource.verb.toUpperCase()+' '+resource.resourcePath, 'green');

  });

  eventEmitter.emit('startServer', app);
}

function serveAPI(app){
  log('api created, listening on: localhost:3000', 'green');
  app.listen(3000);
}

eventEmitter.on('parsedConfig', makeAPI);
eventEmitter.on('startServer', serveAPI);

readConfig();
