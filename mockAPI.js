#!/usr/bin/env node

var prompt = require('prompt');
var chalk = require('chalk');

var express = require('express');

var events = require('events');
var eventEmitter = new events.EventEmitter();


function parseVerbs(err, result){
  if(err){ return onErr(err); }
  var verbs = result.verbs
    .split(' ')
    .map( function(item){ return item.trim().toUpperCase(); } );
  console.log('\n\ncool, we will use: '+verbs+'\n'); 
  
}

function onErr(err){
  console.log(err);
  return 1;
}

// options: {
//  resources: [
//    {
//      name: <resource_name>,
//      verbs: [<get,post,put,delete>],
//      data: [{(json_dummy_data>}]
//    },
//    ...
//  ]
// }
function makeAPI(options){
}

// set up prompt
prompt.message = ">>".green;
console.log(chalk.blue("\nLet's make you an api (just one resource for now)!!\n"));
console.log(chalk.magenta('What REST verbs do you want to use for this resource? ( get post put delete)\n Separate by spaces.'));
prompt.start();
prompt.get(['verbs'], parseVerbs);  


