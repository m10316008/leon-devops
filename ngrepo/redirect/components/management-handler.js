var fs = require('fs');
var path = require('path');
var checkIp = require('../components/check-ip');


/* return the file extension, for example :
 * ext('abc.css')
 * return 'css'
 */
function ext(fileName) {
    var raw = fileName.split('.');
    return raw[raw.length - 1];
}

// define of brand
const BRAND = ['ironman', 'apple', 'funcity', 'h9393', 'mango', 'ubs', 'warrior'];

function managementHandler(req, res) {
    var urlSplit = req.url.split('/');
    var subPath = urlSplit.length > 2 ? urlSplit[2] : '';
    subPath = subPath.split('?')[0];


    // if path equal to brand, render as index.html
    // e.g.  /management/mango = mango, render as index.html
    // e.g.  /management/h9393 = h9393, render as index.html
    if (BRAND.indexOf(subPath) >= 0) {
        subPath = '';
    }


    switch (subPath) {
        case "domain.json":
            fs.readFile(path.resolve(__dirname, '../logs/domain.json'), function (err, data) {
                if (err) {
                    res.end('404 not found');
                    //console.log(err);
                } else {
                    res.writeHead(202, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
            break;

        case "ssl-domain.json":
            res.writeHead(202, { "Content-Type": "application/json" });
            res.end(JSON.stringify(global.cert));
            break;

        case "":
            fs.readFile(path.resolve(__dirname, '../public/management/index.html'), function (err, data) {
                if (err) {
                    res.end('404 not found');
                    //console.log(err);
                } else {
                    res.end(data);
                }
            });
            break;

        default:
            var filePath = req.url.replace('/management/', '');
            //console.log(filePath);

            fs.readFile(path.resolve(__dirname, '../public/management', filePath), function (err, data) {
                if (err) {
                    res.end('404 not found : ' + filePath);
                    //console.log(err);
                } else {
                    if (ext(filePath).toLowerCase() == 'css') {
                        res.writeHead(202, { "Content-Type": "text/css" });
                    }
                    res.end(data);
                }
            });
    }

}

module.exports = managementHandler;
