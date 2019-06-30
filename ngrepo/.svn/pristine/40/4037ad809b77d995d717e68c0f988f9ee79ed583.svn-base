var path = require('path');
var fs = require('fs');


function defineConf(sourcePath, key) {
    return fs.readFileSync(path.resolve(sourcePath, "ng", "define-" + key + ".conf"), "utf8");
}

exports.header = function (conf) {
    return defineConf(conf.sourcePath, "header");
}

exports.footer = function (project, conf) {
    var text = defineConf(conf.sourcePath, "footer");
    text = text.replace(/______BRAND______/g, conf.brand);
    text = text.replace(/______STAGE______/g, conf.stage);
    text = text.replace(/______PROJECT______/g, project);
    return text;
}

exports.brand = function (conf) {
    var tplText = fs.readFileSync(path.resolve(conf.sourcePath, "ng", "tpl-brand.conf"), "utf8");
    var outputConf = tplText;
    outputConf = outputConf.replace(/______BRAND______/g, conf.brand);
    outputConf = outputConf.replace(/______STAGE______/g, conf.stage);
    outputConf = outputConf.replace(/______UPSTREAM______/g, conf.upstream);
    outputConf = outputConf.replace(/______DEFINED_CACHE______/g, defineConf(conf.sourcePath, "cache"));

    return outputConf;
}

exports.jetsostatic = function (conf) {
    var tplText = fs.readFileSync(path.resolve(conf.sourcePath, "ng", "tpl-jetsostatic.conf"), "utf8");
    var outputConf = tplText;
    outputConf = outputConf.replace(/______BRAND______/g, conf.brand);
    //outputConf = outputConf.replace(/______STAGE______/g, conf.stage);
    outputConf = outputConf.replace(/______UPSTREAM______/g, conf.upstream);
    //outputConf = outputConf.replace(/______DEFINED_CACHE______/g, defineConf(conf.sourcePath, "cache"));

    return outputConf;
}

exports.desktop188 = function (project, conf) {
    var tplText = fs.readFileSync(path.resolve(conf.sourcePath, "ng", "tpl-desktop188.conf"), "utf8");
    var outputConf = tplText;
    outputConf = outputConf.replace(/______BRAND______/g, conf.brand);
    outputConf = outputConf.replace(/______STAGE______/g, conf.stage);
    outputConf = outputConf.replace(/______UPSTREAM______/g, conf.upstream);
    outputConf = outputConf.replace(/______DEFINED_CACHE______/g, defineConf(conf.sourcePath, "cache"));
    outputConf = outputConf.replace(/______PROJECT______/g, project);
    return outputConf;
}

exports.mobile188 = function (conf) {
    var tplText = fs.readFileSync(path.resolve(conf.sourcePath, "ng", "tpl-mobile188.conf"), "utf8");
    var outputConf = tplText;
    outputConf = outputConf.replace(/______BRAND______/g, conf.brand);
    outputConf = outputConf.replace(/______STAGE______/g, conf.stage);
    outputConf = outputConf.replace(/______UPSTREAM______/g, conf.upstream);
    outputConf = outputConf.replace(/______DEFINED_CACHE______/g, defineConf(conf.sourcePath, "cache"));

    return outputConf;
}

exports.mobileOnly = function (project, conf, isofficeapp) {

    var tplText = fs.readFileSync(path.resolve(conf.sourcePath, "ng", "tpl-mobile-app.conf"), "utf8");
    var outputConf = tplText;
    if (isofficeapp) {
        outputConf = outputConf.replace(/______APP-SERVICE______/g, defineConf(conf.sourcePath, "isofficeapp"));
    } else {
        outputConf = outputConf.replace(/______APP-SERVICE______/g, '');
    }
    outputConf = outputConf.replace(/______BRAND______/g, conf.brand);
    outputConf = outputConf.replace(/______STAGE______/g, conf.stage);
    outputConf = outputConf.replace(/______UPSTREAM______/g, conf.upstream);
    outputConf = outputConf.replace(/______DEFINED_CACHE______/g, defineConf(conf.sourcePath, "cache"));
    outputConf = outputConf.replace(/______PROJECT______/g, project);

    return outputConf;
}
/*exports.fishHunter = function (project, conf, isofficeapp) {
    var tplText = fs.readFileSync(path.resolve(conf.sourcePath, "ng", "tpl-fish-hunter.conf"), "utf8");
    var outputConf = tplText;
    var outputConf = outputConf.replace(/______PROJECT______/g, project);
    if (isofficeapp) {
        outputConf = outputConf.replace(/______APP-SERVICE______/g, defineConf(conf.sourcePath, "isofficeapp"));
    } else {
        outputConf = outputConf.replace(/______APP-SERVICE______/g, '');
    }
    outputConf = outputConf.replace(/______BRAND______/g, conf.brand);
    outputConf = outputConf.replace(/______UPSTREAM______/g, conf.upstream);
    outputConf = outputConf.replace(/______DEFINED_CACHE______/g, defineConf(conf.sourcePath, "cache"));
    outputConf = outputConf.replace(/______PROJECT______/g, project);
    outputConf = outputConf.replace(/______STAGE______/g, conf.stage);

    return outputConf;
}*/


exports.s3bucket = function (conf) {

    var tplText = fs.readFileSync(path.resolve(conf.sourcePath, "ng", "tpl-s3bucket.conf"), "utf8");
    var outputConf = tplText;
    outputConf = outputConf.replace(/______UPSTREAM______/g, conf.upstream);
    outputConf = outputConf.replace(/______UPSTREAM_BACKUP______/g, conf.upstream_backup);

    return outputConf;
}

exports.agentConf = function (conf) {
    var tplText = fs.readFileSync(path.resolve(conf.sourcePath, "ng", "tpl-agent.conf"), "utf8");
    var outputConf = tplText;
    outputConf = outputConf.replace(/______STAGE______/g, conf.stage);
    outputConf = outputConf.replace(/______BRAND______/g, conf.brand);
    return outputConf;
}


/*exports.prod_current = function (conf) {

    var tplText = fs.readFileSync(path.resolve(conf.sourcePath, "ng", "tpl-prod_current.lua"), "utf8");
    var outputConf = tplText;
    outputConf = outputConf.replace(/______BRAND______/g, conf.brand);
    outputConf = outputConf.replace(/______UPSTREAM______/g, conf.upstream);

    return outputConf;
}*/