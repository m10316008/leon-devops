$(document).ready(function(){
    console.log('start base');
    base_runner();
});
function base_check(){
    console.log('base_check');
    var url = '/base/api';
    $.post(url,{action:'check_session'},function(json){
        if(json.success==0){
            window.location.href='/';
        }else{
            var rev = json.nginxBossVersion;
            $('#nginxBossVersion').html('Rev:'+rev);
        }
        return false;
    });
}
function base_runner() {
    var base_timer = setInterval(function () {
        console.log('refresh');
        base_check();
    }, 30*1000);
}
