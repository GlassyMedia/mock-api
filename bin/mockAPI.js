#!/usr/bin/env node
'use strict';
var events = require('events');
var eventEmitter = new events.EventEmitter();

var fs = require('fs');
var chalk = require('chalk');

var express = require('express');
var bodyParser = require('body-parser');

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
  var randNum = parseInt(Math.random()*20, 10)+2;
  return Array.apply(null, Array(randNum))
    .map(function(){
      return generateJsonSchema(JSON.parse(schema));
    });
}

function makeAPI(config){
  var schemaRoot = config.schemasPath

  var app = express();
  app.use(bodyParser());

  log('Creating resources:', 'green');

  config.resources.forEach( function(resource){
    var dummyData = generateFromSchema(schemaRoot+resource.schema);
    var verb = resource.verb.toLowerCase();

    if(verb==='get'){
      app.get(resource.resourcePath, function(req, res){
        if(req.params.id){
          var data = dummyData[req.params.id];
          if(data){
            res.json(data);
          }else{
            res.json({}, 404);
          }
        }else{
          res.json(dummyData);
        }
      });
    }
    if(verb==='post'){
      app.post(resource.resourcePath, function(req, res) {
        var fakedID = dummyData.length+1;
        res.setHeader('Location', resource.resourcePath+'/'+fakedID);
        req.body.id = fakedID;
        // echo body
        res.json(req.body, 201);
      });
    }
    if(verb==='put'){
      app.put(resource.resourcePath, function(req, res) {
        var fakedID = dummyData.length+1;
        res.setHeader('Location', resource.resourcePath+'/'+fakedID);
        req.body.id = fakedID;
        // echo body
        res.json(req.body, 200);
      });
    }
    if(verb==='delete'){
      app.del(resource.resourcePath+'/:id', function(req, res) {
        res.json({}, 204);
      });
    }

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
