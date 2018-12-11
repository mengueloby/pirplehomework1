/*
 * This is the first homework for pirple course
 * Made by Frederic PAPY
*/


// Dependencies
var http=require('http');
var url=require('url');
var StringDecoder=require('string_decoder').StringDecoder;
var config=require('./config');


 // Instantiate the HTTP server
var httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});

// Start the HTTP server
httpServer.listen(config.httpPort,function(){
  console.log(config.locale[config.applocale].server_on + config.httpPort +config.locale[config.applocale].server_mode);
});

// All the server logic for both the http and https server
var unifiedServer = function(req,res){

  // Parse the url
  var parsedUrl = url.parse(req.url, true);

  // Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  // Get the payload,if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
      buffer += decoder.write(data);
  });
  req.on('end', function() {
      buffer += decoder.end();

      // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
      var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
      statusCode = typeof(statusCode) == 'number' ? statusCode : 404;
      var data ={};
      if(trimmedPath==='hello'){
          // Construct the data object to send to the handler    
          data = {
            'gretings' : config.locale[config.applocale].greatings, 
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
          };        
      }
      
      

      // Route the request to the handler specified in the router
      chosenHandler(data,function(statusCode){

        // Use the payload returned from the handler, or set the default payload to an empty object
        data = typeof(data) == 'object' ? data : {};
        // Convert the payload to a string
        var message = JSON.stringify(data);  

        // Return the response
        res.setHeader('Content-Type', 'application/json');
        res.end(message);
      });

  });
};

// Define all the handlers
var handlers = {};

// Ping handler
handlers.hello = function(data,callback){
    callback(200);
};

// Not-Found handler
handlers.notFound = function(data,callback){
  callback(404);
};

// Define the request router
var router = {
  'hello' : handlers.hello
};