function CmdArgv(args) {
    //console.log(args);
    var setting = {};

    for (var i = 0; i < args.length; i++) {
        //console.log(args[i]);
        var raw0 = args[i].split('=');

        if (raw0.length >= 2) {
            var raw1 = raw0[0].split('-');
            if (raw1.length >= 2) {
                var key = raw1[1];
                var value = raw0[1];
                setting[key.trim()] = value.trim();
            }
        }

        if (raw0[0].toLowerCase().trim() === '-help') {
            setting.help = true;
        }
    }

    return setting;
}

module.exports = CmdArgv;