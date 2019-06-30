const crypto = require('crypto');
const fs = require('fs');
var path = require('path');

var MAX_ENCRYPT_BLOCK = 117 - 31;
var MAX_DECRYPT_BLOCK = 128;

/*
* public encrypt --> private decrypt
*
* private encrypt --> public decrypt*
*
* */

function publicEncrypt(data, publicPem) {
    //得到公钥
    //var publicPem = fs.readFileSync(path.join(__dirname, "mykey.pub"));//替换你自己的路径
    var publicKey = publicPem.toString();
    //加密信息用buf封装
    var buf = new Buffer(data, "utf-8");
    //buf转byte数组
    var inputLen = buf.byteLength;
    //密文
    var bufs = [];
    //开始长度
    var offSet = 0;
    //结束长度
    var endOffSet = MAX_ENCRYPT_BLOCK;
    //分段加密
    while (inputLen - offSet > 0) {
        if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
            var bufTmp = buf.slice(offSet, endOffSet);
            bufs.push(crypto.publicEncrypt({ key: publicKey, padding: crypto.RSA_PKCS1_PADDING }, bufTmp));
        } else {
            var bufTmp = buf.slice(offSet, inputLen);
            bufs.push(crypto.publicEncrypt({ key: publicKey, padding: crypto.RSA_PKCS1_PADDING }, bufTmp));
        }
        offSet += MAX_ENCRYPT_BLOCK;
        endOffSet += MAX_ENCRYPT_BLOCK;
    }
    var result = Buffer.concat(bufs);
    //密文BASE64编码
    var base64Str = result.toString("base64");
    //console.log(base64Str);
    return base64Str;
}
function publicDecrypt(data, publicPem) {

    //得到私钥
    //var publicPem = fs.readFileSync(path.join(__dirname, "mykey.pub"));//替换你自己的路径
    var publicKey = publicPem.toString();
    //经过base64编码的密文转成buf
    var buf = new Buffer(data, "base64");

    //buf转byte数组
    //var inputLen = bytes(buf, "base64");
    var inputLen = buf.byteLength;
    //密文
    var bufs = [];
    //开始长度
    var offSet = 0;
    //结束长度
    var endOffSet = MAX_DECRYPT_BLOCK;
    //分段加密
    while (inputLen - offSet > 0) {
        if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
            var bufTmp = buf.slice(offSet, endOffSet);
            bufs.push(crypto.publicDecrypt({ key: publicKey, padding: crypto.RSA_PKCS1_PADDING }, bufTmp));
        } else {
            var bufTmp = buf.slice(offSet, inputLen);
            bufs.push(crypto.publicDecrypt({ key: publicKey, padding: crypto.RSA_PKCS1_PADDING }, bufTmp));
        }
        offSet += MAX_DECRYPT_BLOCK;
        endOffSet += MAX_DECRYPT_BLOCK;
    }
    var result = Buffer.concat(bufs).toString();
    //console.log(result);
    return result;
}
function privateEncrypt(data, privatePem) {

    //得到私钥
    //var privatePem = fs.readFileSync(path.join(__dirname, "mykey.pem"));
    var privateKey = privatePem.toString();
    //经过base64编码的密文转成buf
    var buf = new Buffer(data, "utf-8");
    //buf转byte数组
    var inputLen = buf.byteLength;
    //密文
    var bufs = [];
    //开始长度
    var offSet = 0;
    //结束长度
    var endOffSet = MAX_ENCRYPT_BLOCK;
    //分段加密
    while (inputLen - offSet > 0) {
        if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
            var bufTmp = buf.slice(offSet, endOffSet);
            bufs.push(crypto.privateEncrypt({ key: privateKey, padding: crypto.RSA_PKCS1_PADDING }, bufTmp));
        } else {
            var bufTmp = buf.slice(offSet, inputLen);
            bufs.push(crypto.privateEncrypt({ key: privateKey, padding: crypto.RSA_PKCS1_PADDING }, bufTmp));
        }
        offSet += MAX_ENCRYPT_BLOCK;
        endOffSet += MAX_ENCRYPT_BLOCK;
    }
    var result = Buffer.concat(bufs);
    //密文BASE64编码
    var base64Str = result.toString("base64");
    //console.log(base64Str);
    return base64Str;
}
function privateDecrypt(data, privatePem) {

    //得到私钥
    //var privatePem = fs.readFileSync(path.join(__dirname, "mykey.pem"));
    var privateKey = privatePem.toString();
    //经过base64编码的密文转成buf
    var buf = new Buffer(data, "base64");

    //buf转byte数组
    //var inputLen = bytes(buf, "base64");
    var inputLen = buf.byteLength;
    //密文
    var bufs = [];
    //开始长度
    var offSet = 0;
    //结束长度
    var endOffSet = MAX_DECRYPT_BLOCK;
    //分段加密
    while (inputLen - offSet > 0) {
        if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
            var bufTmp = buf.slice(offSet, endOffSet);
            bufs.push(crypto.privateDecrypt({ key: privateKey, padding: crypto.RSA_PKCS1_PADDING }, bufTmp));
        } else {
            var bufTmp = buf.slice(offSet, inputLen);
            bufs.push(crypto.privateDecrypt({ key: privateKey, padding: crypto.RSA_PKCS1_PADDING }, bufTmp));
        }
        offSet += MAX_DECRYPT_BLOCK;
        endOffSet += MAX_DECRYPT_BLOCK;
    }
    var result = Buffer.concat(bufs).toString();
    //console.log(result);
    //解密
    return result;
}


function encrypt(plainText) {
    //console.log('encrypt-tools.js\tencrypt');
    return plainText + '--';
}

function decrypt(cipherText) {
    //console.log('encrypt-tools.js\tdecrypt');
    return cipherText.substring(0, cipherText.length - 2);
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.publicEncrypt = publicEncrypt;
exports.publicDecrypt = publicDecrypt;
exports.privateEncrypt = privateEncrypt;
exports.privateDecrypt = privateDecrypt;