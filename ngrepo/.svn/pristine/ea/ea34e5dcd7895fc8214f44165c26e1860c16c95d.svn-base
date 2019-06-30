var StaticInfo = require('../db/static-info');
var fs = require('fs');
var path = require('path');
const encryptTools = require('../utils/encrypt-tools');
async function main() {
    var datas = new Array();
    var infos = await StaticInfo.findAll().map(row=>{
        datas.push(row.dataValues);
        return row.dataValues;
    });
    var json = JSON.stringify(datas);
    console.log(json);
    await fs.writeFileSync('static-info.json', json, 'utf8');
    process.exit();
}
main();