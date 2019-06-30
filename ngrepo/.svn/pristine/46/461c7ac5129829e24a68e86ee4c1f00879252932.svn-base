function parseIpv4(req) {
    var ip = '';

    try {
        ip = req.connection.remoteAddress.replace('::ffff:', '').trim();
    } catch (err) { }

    return ip;
}
async function getFirstIp(arr){

}

module.exports={
    parseIpv4,
    getFirstIp
}
