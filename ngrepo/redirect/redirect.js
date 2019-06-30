#!/usr/bin/env node

/**
 * Module dependencies.
 */
//var debug = require('debug')('redirect:server');
var http = require('http');
var https = require('https');


/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '80');
var portHttps = normalizePort(process.env.PORTHTTPS || '443');


/**
 * Create HTTP request handler.
 */
var requestHandler = require('./components/request-handler');


/**
 * Create HTTP server.
 */
var server = http.createServer(requestHandler);

var sslOptions = require('./components/ssl-options');
var serverHttps = https.createServer(sslOptions, requestHandler);


/**
 * Listen on provided port, on all network interfaces.
 */
var bindingIP = undefined;
if (process.argv.length >= 3) {
    bindingIP = process.argv[2];
    console.log("Binding IP : " + bindingIP);
} else {
    console.log("Listen on all IP.");
}
server.listen(port, bindingIP);
server.on('error', onError);
server.on('listening', onListening);

serverHttps.listen(portHttps, bindingIP);
serverHttps.on('error', onErrorHttps);
serverHttps.on('listening', onListeningHttps);


/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onErrorHttps(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof portHttps === 'string'
        ? 'Pipe ' + portHttps
        : 'Port ' + portHttps;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
function onListeningHttps() {
    var addr = serverHttps.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
