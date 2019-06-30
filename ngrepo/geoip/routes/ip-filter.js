var express = require("express");
var router = express.Router();

var asyncMiddleWare = require("./async-middle-ware");
var getIp = require("../services/get-ip");
var ipQuery = require("../services/ip-query");
var redis = require("../services/redis");

router.get(
	"/*",
	asyncMiddleWare(async (req, res, next) => {
		var ipAddr = getIp(req);
		if (req.query.ip) {
			ipAddr = req.query.ip;
		}

		var model = {
			layout: false,
			allowip: true,
			clientip: ipAddr,
			mainRedirectFunction: ""
		};

		// check is blocked country
		try {
			var ipInfo = ipQuery.maxmind(ipAddr);
			if (global.whitelist.blocked.indexOf(ipInfo.country) >= 0) {
				console.log(
					"Blocked country ( " + ipAddr + " ) : " + ipInfo.country
				);
				model.allowip = false;
			}
			//console.log(`IP :${ipAddr} , country:${ipInfo.country}`);
		} catch (err) {}

		// check is white list IP
		if (!model.allowip && global.whitelist.ip.indexOf(ipAddr) >= 0) {
			console.log(
				"Whitelist IP [" +
					global.whitelist.ip.indexOf(ipAddr) +
					"] : " +
					ipAddr
			);
			model.allowip = true;
		}

		// check is temporary white list IP
		if (!model.allowip && (await redis.get("temp:whitelist:" + ipAddr))) {
			console.log("Whitelist temporary : " + ipAddr);
			model.allowip = true;
		}

		if (model.allowip) {
			//model.redirectFunction = 'v5477geoip_mainRedirect();';
			model.redirectFunction = "";
		} else {
			model.redirectFunction = "v5477geoip_forbiddenRedirect();";
		}

		res.set("Content-Type", "application/javascript; charset=utf-8");
		res.render("ip-filter", model);
	})
);

module.exports = router;
