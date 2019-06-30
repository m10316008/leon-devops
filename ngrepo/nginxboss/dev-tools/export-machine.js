var Machine = require('../db/machine');
var fs = require('fs');
var path = require('path');
var rsaPath = path.join(__dirname, '..', '.rsa');
var pubPem = fs.readFileSync(path.join(rsaPath,'mykey.pub'));
var priPem = fs.readFileSync(path.join(rsaPath,'mykey.pem'));
const encryptTools = require('../utils/encrypt-tools');
async function main() {
    var datas = new Array();
    var machines = await Machine.findAll().map(row=>{
        row.dataValues.username = encryptTools.privateDecrypt(row.dataValues.username,priPem);
        row.dataValues.password = encryptTools.privateDecrypt(row.dataValues.password,priPem);
        row.dataValues.sshKey = encryptTools.privateDecrypt(row.dataValues.sshKey,priPem);
        datas.push(row.dataValues);
        return row.dataValues;
    });
    var json = JSON.stringify(datas);
    console.log(json);
    await fs.writeFileSync('export_machine.json', json, 'utf8');
    process.exit();
}
main();