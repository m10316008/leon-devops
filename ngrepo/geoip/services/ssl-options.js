var path = require('path');
var fs = require('fs');
var tls = require('tls');

//default cert
var defaultCert = {
    key: fs.readFileSync(path.resolve(__dirname, '../certs', 'default.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../certs', 'default.crt'))
}

// define the model
var secureContext = {};


// define ssl certificates
secureContext['default'] = tls.createSecureContext({
    key: defaultCert.key,
    cert: defaultCert.cert
});

// define ssl for https://analytics.cloudfront-ssl.com
secureContext['analytics.cloudfront-ssl.com'] = tls.createSecureContext({
    key: fs.readFileSync(path.resolve(__dirname, '../certs', 'analytics.cloudfront-ssl.com.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../certs', 'analytics.cloudfront-ssl.com.crt')),
    ca: fs.readFileSync(path.resolve(__dirname, '../certs', 'analytics.cloudfront-ssl.com.ca.crt'))
});



// create sslOptions for used by http server
var sslOptions = {
    SNICallback: function (domain, cb) {
        if (secureContext[domain]) {
            cb(null, secureContext[domain]);
        } else {
            //throw new Error('No keys/certificates for domain requested');
            cb(null, secureContext['default']);
        }
    },
    // must list a default key and cert because required by tls.createServer()
    key: defaultCert.key,
    cert: defaultCert.cert
}

module.exports = sslOptions;