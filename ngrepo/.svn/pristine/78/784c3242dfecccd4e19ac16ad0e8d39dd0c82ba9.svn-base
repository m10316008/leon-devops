var os = require('os');
var path = require('path');
var fs = require('fs');
var tls = require('tls');


var settingBrand = require('../setting-brand.json');
var settingDomain = require('../setting-domain.json');


/* return the file extension, for example :
 * ext('hello.com.key')
 * return 'key'
 */
function ext(fileName) {
    var raw = fileName.split('.');
    return raw[raw.length - 1];
}


// define the Global Model
global.domain = {};
global.cert = {};

// define the model
var defaultCert = {
    key: '',
    cert: ''
}


var secureContext = {

}


// lookup the folder of "certs"
var path_of_certs = path.resolve(__dirname, '../certs');
fs.readdirSync(path_of_certs).forEach(folder => {
    var currentPath = path.resolve(__dirname, '../certs', folder);

    if (fs.statSync(currentPath).isDirectory()) {
        fs.readdirSync(currentPath).forEach(file => {
            if (ext(file) == 'key') {
                var certPath = path.resolve(currentPath, file);

                var hostName = file.replace('.key', '').toLowerCase();

                /* if the hostName is "hello.com", domains = ['hello.com','www.hello.com']
                 * if the hostName is "www.super.com", domains = ['www.super.com']
                 */
                var domains = [hostName];
                if (hostName.indexOf('www.') != 0) {
                    domains.push('www.' + hostName);
                }
                //console.log(domains);

                // create secureContext for each domain
                domains.forEach(domain => {
                    var tlsObject = {
                        key: fs.readFileSync(path.resolve(currentPath, hostName + '.key')),
                        cert: fs.readFileSync(path.resolve(currentPath, hostName + '.crt'))
                    };

                    try {
                        tlsObject.ca = fs.readFileSync(path.resolve(currentPath, hostName + '.ca.crt'));
                    } catch (err) {
                    }

                    secureContext[domain] = tls.createSecureContext(tlsObject);

                    //record domain which has certificate file
                    global.cert[domain] = true;

                    //save into global.domain, use by handler on the redirect.js
                    global.domain[domain] = {
                        brand: folder
                    }
                    if (settingBrand[folder]) {
                        global.domain[domain].dest = settingBrand[folder];
                    }
                });
            }
        });
    } else {
        // process the default key and default crt
        switch (ext(currentPath)) {
            case 'key':
                defaultCert.key = fs.readFileSync(currentPath);
                break;
            case 'crt':
                defaultCert.cert = fs.readFileSync(currentPath);
                break;
        }
    }
});


// assign a default cert for unknown domain
secureContext['default'] = tls.createSecureContext({
    key: defaultCert.key,
    cert: defaultCert.cert
})


// process the remaing domain from 'setting-domain.json'
Object.keys(settingDomain).forEach(function (brand) {
    Object.keys(settingDomain[brand]).forEach(function (domain) {
        global.domain[domain] = {
            brand: brand,
            dest: settingDomain[brand][domain]
        }

        /* if the hostName is "hello.com", create one more domain "www.hello.com"
         * if the hostName is "www.super.com", do nothing
         */
        if (domain.indexOf('www.') != 0) {
            global.domain['www.' + domain] = global.domain[domain];
        }
    });
});
//console.log(global.domain);


// output a log file for reference
try {
    fs.mkdirSync(path.resolve(__dirname, '../logs'));
} catch (err) { }

var logFilePath = path.resolve(__dirname, '../logs', 'domain.json');
try {
    fs.unlinkSync(logFilePath);
} catch (error) { }

fs.writeFile(
    logFilePath,
    //JSON.stringify(domainMappingList).replace(/,/g, ',' + os.EOL).replace('{', '{' + os.EOL).replace('}', os.EOL + '}'),
    JSON.stringify(global.domain, null, 4),
    'utf8',
    function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Create ' + logFilePath + ' completed.');
        }
    }
);


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
