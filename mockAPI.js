#!/usr/bin/env node
'use strict';
var events = require('events');
var eventEmitter = new events.EventEmitter();
var fs = require('fs');
var express = require('express');

var MOCK_CONFIG = {
  configFile: 'mock.json',
};

function onErr(err){
  console.log(err);
  return 1;
}

function readConfig(){
  var mocks = JSON.parse(fs.readFileSync(MOCK_CONFIG.configFile, 'utf8'));

  eventEmitter.emit('parsedConfig', mocks);
}

function makeAPI(mocks){
  var app = express();
  console.log('Createding resources:');

  mocks.forEach( function(mock){
    if (mock.verb.toUpperCase() === 'GET'){
      app.get(mock.resourcePath, function(req, res){
        res.json(mock.dummyData);
      });
      console.log(mock.verb.toUpperCase()+' '+mock.resourcePath);
    }

  });

  eventEmitter.emit('startServer', app);
}

function serveAPI(app){
  console.log('api created, listening on localhost:3000');
  app.listen(3000);
}

eventEmitter.on('parsedConfig', makeAPI);
eventEmitter.on('startServer', serveAPI);

readConfig();
