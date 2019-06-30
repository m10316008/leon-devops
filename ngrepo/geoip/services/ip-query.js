var geoip = require('geoip-lite');

function maxmind(ipAddr) {
    var maxmindInfo = geoip.lookup(ipAddr);

    var info = {
        ip: ipAddr,
        country: maxmindInfo.country,
        city: maxmindInfo.city
    }

    return info;
}

exports.maxmind = maxmind;