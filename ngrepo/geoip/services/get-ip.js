function GetIp(req) {
	var remoteIp =
		req.headers["x-forwarded-for"] || req.connection.remoteAddress;
	//var remoteIp = req.connection.remoteAddress;

	console.log(
		"Remote IP : " +
			req.connection.remoteAddress +
			", final IP : " +
			remoteIp
	);

	try {
		return remoteIp.replace("::ffff:", "");
	} catch (err) {
		console.log("ERROR !!!!!! check-ip.js, remoteIp : " + remoteIp);
		return "127.0.0.1";
	}
}

module.exports = GetIp;
