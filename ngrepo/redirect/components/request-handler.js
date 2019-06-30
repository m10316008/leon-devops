var fs = require("fs");
var path = require("path");
var checkDevice = require("../components/check-device");
var checkIp = require("../components/check-ip");

var settingManagement = require("../setting-management.json");
var managementIp = settingManagement.ip;

var managementHandler = require("./management-handler");

function requestHandler(req, res) {
  // add custom header
  res.setHeader("Server", "nginx/1.17.1");

  var reqHost = req.headers.host;
  var reqUrl = req.url;
  var clientIp = checkIp(req); 
  var urlSplit = reqUrl.split("/");
  var rootPath = urlSplit.length > 1 ? urlSplit[1] : "";
  //console.log(rootPath);
  var show_redirect_debug_data = "404 : /test/redirect : " + 
                                  req.headers.host + " : " + 
								  (new Date()).getTime() ;

  if (reqUrl.indexOf('/test/redirect') === 0){
    res.end( show_redirect_debug_data );
  }

  switch (rootPath) {
    case "info":
      if (global.domain[reqHost]) {
        if (global.domain[reqHost].dest) {
          var destUrl = global.domain[reqHost].dest;
          let reqsplit = {};
          for (let i = 1; i < urlSplit.length; i++) {
            let key = i;
            switch (urlSplit[key]) {
              case "info":
                reqsplit[urlSplit[key]] = urlSplit[key + 1];
                let pathb = urlSplit[key + 1];
                switch (pathb) {
                  case "reg":
                    let uplineId = urlSplit[key + 2];
                    destUrl += `/info/reg/${uplineId}`;
                    res.writeHead(301, {
                      Location: destUrl
                    });
                    res.end();
                    break;
                  default:
                    res.end("404");
                    break;
                }
                break;
              default:
                res.end("404");
                break;
            }
          }
        } else {
          res.end("404");
        }
      } else {
        res.end("404");
      }
      break;
    case "a":
      if (global.domain[reqHost]) {
        if (global.domain[reqHost].dest) {
          var destUrl = global.domain[reqHost].dest;
          let reqsplit = {};
          for (let i = 1; i < urlSplit.length; i++) {
            let key = i;
            switch (urlSplit[key]) {
              case "a":
                reqsplit[urlSplit[key]] = urlSplit[key + 1];
                break;
            }
          }
          if (reqsplit.a != undefined) {
            destUrl += `?upline=${reqsplit.a}`;
          } else {
            destUrl += checkDevice.getPath(req.headers["user-agent"]);
          }
          res.writeHead(301, {
            Location: destUrl
          });
          res.end();
        } else {
          res.end("404");
        }
      } else {
        res.end("404");
      }
      break;
    case "management":
      //console.log('case management from ' + clientIp);
      if (managementIp.indexOf(clientIp) >= 0) {
        // IP whitelisted , process the management request
        managementHandler(req, res);
      } else {
        res.end("404");
      }

      break;
    case ".well-known":
      //console.log('case .well-known');
      fs.readFile(path.resolve(__dirname, "../well-known.txt"), function(
        err,
        data
      ) {
        if (err) {
          res.end("404 not found");
          //console.log(err);
        } else {
          res.end(data);
        }
      });
      //res.end(fs.readFileSync(path.resolve(__dirname, '../well-known.txt')));
      break;
    case "favicon.ico":
      //console.log('case favicon.ico');
      res.end();
      break;
    default:
      //console.log('default 302');

      console.log("======");
      console.log(
        checkIp(req) + "," + req.headers.host + ":" + req.connection.localPort
      );

      if (global.domain[reqHost]) {
        if (global.domain[reqHost].dest) {
          // dest url combine the device path
          var destUrl = global.domain[reqHost].dest;

          // if register url
          if (reqUrl.indexOf("upline") >= 0) {
            //console.log('register : ' + reqUrl);
            destUrl += reqUrl;
          } else {
            if (destUrl.indexOf("upline") == -1) {
              destUrl += checkDevice.getPath(req.headers["user-agent"]);
            }
          }

          console.log(destUrl);

          if (reqUrl == "/debug") {
            res.end(destUrl);
          } else {
            res.writeHead(301, {
              Location: destUrl
            });
            res.end();
          }
        } else {
          res.end("undefined");
        }
      } else {
        res.end("404");
      }
  }
}

module.exports = requestHandler;
