const http = require('http');
const https = require('https');
const zlib = require("zlib");


function HttpGet(options) {
    console.log(options.host + ':' + options.port + '\t->\t' + options.path);
    return new Promise(function (fulfill, reject) {
        var httpClient = options.isHttps ? require('https') : require('http');

        httpClient.get(
            options,
            (response) => {
                let chunks = [];

                response.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                response.on('end', (chunk) => {
                    // console.log('statusCode : ' + response.statusCode);

                    if (response.statusCode == 200) {
                        var contentEncoding = response.headers['content-encoding'];

                        var buffer = Buffer.concat(chunks);
                        if (contentEncoding == 'gzip') {
                            zlib.gunzip(buffer, function (err, decoded) {
                                if (err) {
                                    reject('{ "error": true, "message": "gzip" }');
                                }
                                else {
                                    fulfill({ text: decoded && decoded.toString(), headers: response.headers });
                                }
                            });
                        }
                        else if (contentEncoding == 'deflate') {
                            zlib.inflate(buffer, function (err, decoded) {
                                if (err) {
                                    reject('{ "error": true, "message": "inflate" }');
                                }
                                else {
                                    fulfill({ text: decoded && decoded.toString(), headers: response.headers });
                                }
                            });
                        }
                        else {
                            fulfill({ text: buffer.toString(), headers: response.headers });
                        }
                    } else {
                        reject('{ "error": true, "message": "' + response.statusCode + '" }');
                    }
                });
            }
        ).on(
            "error",
            (err) => {
                reject(err);
            }
        );
    });
}

module.exports = HttpGet;
