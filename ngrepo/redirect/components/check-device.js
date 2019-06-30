
const PATH_MOBILE = '/mobile/';
const PATH_DESKTOP = '/main.html';

function isMobile(userAgent) {
    //console.log('userAgent : ' + userAgent);
    if (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(userAgent))
        return true;

    return false;
}

module.exports = {
    isMobile: isMobile,
    getPath: function (userAgent) {
        if (isMobile(userAgent)) {
            return PATH_MOBILE;
        } else {
            return PATH_DESKTOP;
        }
    }
}
