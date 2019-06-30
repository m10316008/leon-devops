var os = require('os');
var path = require('path');
var fs = require('fs');

var setting = {
    sourcePath: process.argv[1],
    isWindow: process.platform === "win32"
};

setting.cmdArgv = require(path.resolve(setting.sourcePath, "cmd-argv"))(process.argv);
if (setting.cmdArgv.stage) {
    setting.cmdArgv.stage = setting.cmdArgv.stage.toLowerCase();
} else {
    setting.cmdArgv.stage = "prod";
}
setting.profile = require(path.resolve(setting.sourcePath, "profile-" + setting.cmdArgv.brand + ".json"));
console.log(setting);


// ===============================
//  define conf object
// ===============================
var conf = {
    sourcePath: setting.sourcePath,
    brand: setting.cmdArgv.brand,
    stage: setting.cmdArgv.stage,
    upstream: setting.profile.cloudfront_cname,
    upstream_backup: setting.profile.cloudfront_cname_backup
}

var ngLocation = require(path.resolve(setting.sourcePath, "ng", "ng-location"));

console.log("======== Define conf object ========");
console.log(conf);

// ===============================
//  Assemble the nginx conf
// ===============================
console.log("====================================");
console.log("     Assemble the nginx conf");
console.log("====================================");

// assemble the frontend.conf
// brand + mobile + desktop

fs.writeFileSync(
    setting.cmdArgv.stage + "_crm2_frontend.conf",
    ngLocation.header(conf) + ngLocation.brand(conf) + ngLocation.jetsostatic(conf) + ngLocation.mobile188(conf) + ngLocation.desktop188('desktop188', conf) + ngLocation.footer('desktop188', conf),
    "utf8");

// mobile only
fs.writeFileSync(
    setting.cmdArgv.stage + "_crm2_frontend_mobile.conf",
    ngLocation.header(conf) + ngLocation.brand(conf) + ngLocation.jetsostatic(conf) + ngLocation.mobileOnly('mobile188', conf, false) + ngLocation.footer('mobile188', conf),
    "utf8");

fs.writeFileSync(
    setting.cmdArgv.stage + "_crm2_frontend_apps.conf",
    ngLocation.header(conf) + ngLocation.brand(conf) + ngLocation.jetsostatic(conf) + ngLocation.mobileOnly('mobile188apps', conf, false) + ngLocation.footer('mobile188apps', conf),
    "utf8");

fs.writeFileSync(
    setting.cmdArgv.stage + "_crm2_frontend_apps_ios.conf",
    ngLocation.header(conf) + ngLocation.brand(conf) + ngLocation.jetsostatic(conf) + ngLocation.mobileOnly('mobile188appsios', conf, false) + ngLocation.footer('mobile188appsios', conf),
    "utf8");

fs.writeFileSync(
    setting.cmdArgv.stage + "_crm2_frontend_apps_apk.conf",
    ngLocation.header(conf) + ngLocation.brand(conf) + ngLocation.jetsostatic(conf) + ngLocation.mobileOnly('mobile188appsapk', conf, false) + ngLocation.footer('mobile188appsapk', conf),
    "utf8");


fs.writeFileSync(
    setting.cmdArgv.stage + "_crm2_frontend_apps_ios_office_app.conf",
    ngLocation.header(conf) + ngLocation.brand(conf) + ngLocation.jetsostatic(conf) + ngLocation.mobileOnly('mobile188appsios', conf, true) + ngLocation.footer('mobile188appsios', conf),
    "utf8");

fs.writeFileSync(
    setting.cmdArgv.stage + "_crm2_frontend_apps_apk_office_app.conf",
    ngLocation.header(conf) + ngLocation.brand(conf) + ngLocation.jetsostatic(conf) + ngLocation.mobileOnly('mobile188appsapk', conf, true) + ngLocation.footer('mobile188appsapk', conf),
    "utf8");

console.log('conf:', conf);
/*fs.writeFileSync(
    setting.cmdArgv.stage + "_crm2_frontend_apps_apk_office_app_fish_hunter.conf",
    ngLocation.header(conf) + ngLocation.brand(conf) + ngLocation.fishHunter('mobile188appsapk', conf, true) + ngLocation.footer('mobile188appsapk', conf),
    "utf8");*/



fs.writeFileSync(
    "crm2_frontend_s3bucket.conf",
    ngLocation.s3bucket(conf),
    "utf8");
fs.writeFileSync(
    setting.cmdArgv.stage + "_crm2_agent.conf",
    ngLocation.agentConf(conf),
    "utf8");

/*fs.writeFileSync(
    "prod_current.lua",
    ngLocation.prod_current(conf),
    "utf8");*/