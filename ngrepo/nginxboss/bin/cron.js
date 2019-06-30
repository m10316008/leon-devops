var cron = require('node-cron');


cron.schedule('*/30 * * * * *', function(){
    console.log('running a task every 30sec');
    var date = new Date();
    let resp = 'Test: va1_feng_012 node188 dead!!!!@'+date;
    bot.sendMessage(tgalert_chart_id, resp);
});