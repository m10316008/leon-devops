
function checkIp(req) {
    try{
        return req.connection.remoteAddress.replace('::ffff:', '');
    }catch(err){
        return req.connection.remoteAddress;
    }
    
}


module.exports = checkIp;
