var server = require('http').createServer(function(req,res) {
});
var io = require('socket.io')(server, {
    transports: [
        'polling'
    ]
});
/*
io.set('origins', 'http://v2.cosarea.io:7900');
io.origins(['http://v2.cosarea.io:7900']);*/
const Sequelize = require('sequelize');
const db = require('../db/_db');
var Machine = require('../db/machine');
var SSHClient = require('ssh2').Client;
var asyncMiddleWare = require('../routes/async-middle-ware');
const encryptTools = require('../utils/encrypt-tools');
const fs = require('fs');
var pubPem = fs.readFileSync('../.rsa/mykey.pub');
var priPem = fs.readFileSync('../.rsa/mykey.pem');


io.on('connection', asyncMiddleWare(async (socket, res, next) => {
    var requestServer = socket.handshake.query.server;
    //var server_name = 'va1_3535_apple_proxyA_oldProxy';
    var whereObj = {
        where: {
            mcode: requestServer
        }
    };
    var server_info = await Machine.find(whereObj);
    console.log(server_info.mcode);
    var conn = new SSHClient();
    conn.on('ready', function () {
        socket.emit('data', '\r\n*** SSH CONNECTION ESTABLISHED ***\r\n');
        conn.shell({
            term: 'xterm-256color',
            cols: 96
        }, function (err, stream) {
            if (err)
                return socket.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
            socket.on('data', function (data) {
                stream.write(data);
            });
            stream.on('data', function (d) {
                //console.log(d);
                socket.emit('data', d.toString('utf8'));
            }).on('close', function () {
                conn.end();
            });
        });
    }).on('close', function () {
        conn.end();
        socket.emit('data', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
    }).on('error', function (err) {
        conn.end();
        socket.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
        console.log(err.message);

    }).connect({
        host: server_info.primaryIp,
        port: server_info.primaryPort,
        username: encryptTools.privateDecrypt(server_info.username,priPem),
        password: encryptTools.privateDecrypt(server_info.password,priPem),
        readyTimeout:1000*10,
        debug:function(info){
            //console.log(info);
        }
    });
    console.log('finish db');
}));
let socketPort = 8001;
server.listen(socketPort, function () {
    console.log('Listening to port:  ' + socketPort);
});