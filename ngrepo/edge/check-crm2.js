var fs = require('fs');
var path = require('path');

var httpGet = require('./http-get');

var CURRENT_PROXY_SERVER = 'openresty';
var FOLDER_CONF = '/usr/local/openresty/nginx/conf';
const FILENAME_CONF = 'crm2_backend_setting.conf';


// check if exist of openresty
try {
    fs.readFileSync(path.resolve(FOLDER_CONF, FILENAME_CONF), 'utf8');
    //console.log(crm2Setting);
} catch (errOpenresty) {
    var CURRENT_PROXY_SERVER = 'nginx';
    var FOLDER_CONF = '/etc/nginx/conf';

    try {
        fs.readFileSync(path.resolve(FOLDER_CONF, FILENAME_CONF), 'utf8');
        //console.log
    } catch (errNginx) {
        console.log('Cannot found openresty or nginx.')
        process.exit();
    }
}

console.log(CURRENT_PROXY_SERVER);
console.log(FOLDER_CONF);


function parseUpstreamConf(conf_path) {
    var AllLines = fs.readFileSync(conf_path, 'utf8').split(';');
    //console.log(AllLines);

    // ignore the upstream, # comment
    var servers = AllLines.filter(l => {
        return l.toLowerCase().indexOf('server') >= 0
            && l.toLowerCase().indexOf('upstream') < 0
            && l.toLowerCase().indexOf('#') < 0;
    });
    //console.log(servers);

    // convert to the object, then push to the result : serverIps.
    var serverIps = new Array();
    servers.forEach(s => {
        var obj = {
            isHttps: false,
            host: s.replace('server', '').split(':')[0].trim().split(' ')[0],
            port: 80
        }
        try {
            obj.port = parseFloat(s.replace('server', '').split(':')[1].split(' ')[0].trim());
        } catch (err) { }

        //console.log(obj);
        serverIps.push(obj);
    });

    return serverIps;
}

var crm2Servers = parseUpstreamConf(path.resolve(FOLDER_CONF, FILENAME_CONF), 'http://');
//console.log(crm2Servers);


function checkUpstream() {
    if (crm2Servers.length > 0) {
        var crm2Server = crm2Servers.splice(0, 1)[0];


        var options = {
            isHttps: crm2Server.isHttps,
            method: "GET",
            host: crm2Server.host,
            port: crm2Server.port,
            path: '/login',
            "headers": {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive',
                'Host': crm2Server.host,
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36"
            }
        };

        var startTimer = (new Date()).getTime();

        httpGet(options).then(result => {
            var endTimer = (new Date()).getTime() - startTimer;
            endTimer = (endTimer / 1000).toFixed(2);
            try {
                var title = result.text.split('<title>')[1].split('</title>')[0];
                console.log(title + '\t' + endTimer + ' seconds');
            } catch (err) {
                console.log('context error !!!!!!');
            }
            checkUpstream();
        }).catch(err => {

            console.log('error !!!!!!');
        });

    } else {
        console.log('Check completed.');
    }
}
checkUpstream();