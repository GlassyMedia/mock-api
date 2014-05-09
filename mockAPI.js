#!/usr/bin/env node

var express = require('express');

  
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
  var app = express();
  resources.forEach(makeEndpoints);

  return app;
}


