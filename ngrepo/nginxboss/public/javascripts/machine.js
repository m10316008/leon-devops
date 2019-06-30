

function resetForm() {
    $("#btnCreateMachine").hide();
    $("#btnUpdateMachine").hide();

    //$("#username").attr('readonly', 'readonly');

    $("#formModal input").each(function (index) {
        $(this).val('');
    });
    $("#formModal select").each(function (index) {
        $(this).prop("selectedIndex", 0);
    });
}
function clickCreateMachine() {
    console.log('clickCreateMachine');
    $("#btnCreateMachine").button('loading');
    //console.log('loading');
    var data = $('#formMachine').formSerialize();
    $.ajax({
        url: 'machine/machine',
        type: 'PUT',
        data: data,
        success: function (json) {
            if(json.success=='1'){
                location.reload();
            }else{
                alert('建立 Error !');
                $("#btnCreateMachine").button('reset');
            }
            return false;
        }
    });
}
function clickUpdateMachine(){
    $("#btnUpdateMachine").button('loading');
    var data = $('#formMachine').formSerialize();
    $.ajax({
        url: 'machine/machine',
        type: 'PATCH',
        data: data,
        success: function (json) {
            if (json.success=='1') {
                location.reload();
            } else {
                alert('保存 Error !')
                $("#btnUpdateMachine").button('reset');
            }
            return false;
        }
    });
}
function clickShowForm(target) {
    var isEdit = true;
    if (target.trim().length <= 0) {
        isEdit = false;
    }
    resetForm();
    if (isEdit) {
        $.get("machine/machine?mcode=" + target, function (data) {
            $("#mcode").val(data.mcode);
            $('#vcode').val(data.vcode);
            $('#password').val('*****');
            $('#password1').val('*****');
            $("#username").val(data.username);
            $("#mtype").val(data.mtype);
            $("#primaryIp").val(data.primaryIp);
            $("#primaryPort").val(data.primaryPort);
            $("#remark").val(data.remark);
            $("#remarktag").val(data.remarktag);

            $("#sshKey").val(data.sshKey);
            if(data.enable==true){
                $("#enable").val(1);
            }else{
                $("#enable").val(0);
            }
            $("#vendor").val(data.vendor);
            console.log(data.firstPayment);
            $("#firstPayment").val(data.firstPayment);
            $('.datepicker').datepicker('update');
            $("#location").val(data.location);
            $("#mclass").val(data.mclass);
            $("#price").val(data.price);

            /*$("#active").val(data.active.toString());
            $("#brand").val(data.brand);
            $("#username").val(data.username);
            */

            $("#btnUpdateMachine").show();
        });
    } else {
        $("#mcode").removeAttr('readonly');
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        if(dd<10) {
            dd = '0'+dd
        }
        if(mm<10) {
            mm = '0'+mm
        }

        today = yyyy+'-'+mm+'-'+dd;
        $("#btnCreateMachine").show();
        $("#firstPayment").val(today);
        $('.datepicker').datepicker('update');
        $('#primaryPort').val('9822');
        $('#sshKey').val('--');
        $('#remark').val('');
    }
    $("#formModal").modal('show');
}

function validateForm(data) {
    return true;
}

/*function callWinScp(mcode) {
    $.get("machine/machine?mcode=" + mcode, function (data) {
        var sftp = "sftp://" + data.username + ":" + data.password + "@" + data.primaryIp + ":" + data.primaryPort;
        window.location = sftp;
    });
}*/

/*function run_search() {
    var url = 'machine?test=true';

    //var show_disable = '';
    if ($('#show_disable:checked').length > 0) {
        //show_disable = '&show_disbale=true'
        url += '&show_disbale=true';
    }
    var value = $('#search_value').val().trim();
    var url = 'machine?value=' + value;
    if (value.length == 0) {
        url = 'machine';
    }
    window.location = url;
}*/

function run_search() {
    var show_disable = '';
    if ($('#show_disable:checked').length > 0) {
        show_disable = 'true';
    }
    var value = $('#search_value').val().trim();
    var search_obj = {
        show_disable: show_disable,
        value: value
    }
    var querystr = '';
    for (var key in search_obj) {
        if (search_obj[key] == '') {
            continue;
        }
        if (querystr != "") {
            querystr += "&";
        }
        querystr += key + "=" + encodeURIComponent(search_obj[key]);
    }
    var url = 'machine?' + querystr;
    if (querystr == '') {
        url = 'machine';
    }
    window.location = url;
}

function xtermBatchCheck() {
    $check_all = $('#xcheck_all:checked').length;
    $('.xcheck').each(function () {
        var $this = $(this);
        if ($check_all) {
            $this.prop('checked', true);
        } else {
            $this.prop('checked', false);
        }
    });
}

$(document).ready(function () {
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd'
    });
    xtermBatchCheck();
    //console.log('ready');
    $('#xcheck_all').on('click', function () {
        xtermBatchCheck();
    });
    $('#search_value').on('keyup', function (e) {
        if (e.keyCode == 13) {
            run_search();
        }
    });
    $('#start_xterm').on('click', function () {
        var checked = [];
        $('.xcheck:checked').each(function () {
            var $this = $(this);
            //console.log($this.val());         
            checked.push($this.val());
        });
        var url = 'machine/xterm';
        $.redirect(url, {
            'servers': checked
        }, "POST", "_blank");
        //console.log(checked);
    });
    $('.action').each(function () {
        var $this = $(this);
        var action_case = $this.data('action_case');
        switch (action_case) {
            case 'scp':
                $this.off('click').on('click', function () {
                    var mcode = $this.data('mcode');
                    var url = 'machine/machine?mcode=' + mcode;
                    $.get(url, function (data) {
                        var sftp = "sftp://" + data.username + ":" + encodeURIComponent(data.password) + "@" + data.primaryIp + ":" + data.primaryPort;
                        console.log('sftp:',sftp);
                        window.location = sftp;
                    });
                });
                break;
        }
    });
    $('.machine_ip').on('click',function(){
        $('#loadingDialog').modal('show');
        var ele = $(this);
        var options = ele.data('options');
        var url = 'machine/api';
        var data = {
            mcode:options.mcode,
            action:'get_ips'
        };
        $.post(url,data,function(json){
            setTimeout(function(){
                $('#loadingDialog').modal('hide');

            }, 1000);
            //console.log(json);
            var fullip = json.fullip;
            var netmaskCal=json.netmaskCal;
            var primaryIp = json.primaryIp;
            $('#ipsModalContent').html('');
            var html='';
            html+='<div><input type="text" class="form-control copyip" value="'+options.mcode+'" /></div>';
            $('#ipsModalHeader').html(html);
            var html='';
            html+='<br>';
            html+='<p>所有IP:</p>';
            for(idx in fullip){
                if(fullip[idx]==primaryIp){
                    html+='<input type="text" class="form-control copyip text-primary" value="'+fullip[idx]+'"/>';
                }else{
                    html+='<input type="text" class="form-control copyip" value="'+fullip[idx]+'"/>';
                }
            }
            html+='<br>';
            html+='<p>Netmask 計算: (for aws security group)</p>';
            html+='<input  type="text" class="form-control copyip" value="'+netmaskCal+'" />';

            $('#ipsModalContent').html(html);

            if(json.ip64v2==1 && json.ip64v2_data.length!=0){
                console.log('ip64v2_data.length:', json.ip64v2_data.length);
                var dividedby=5;
                $('#ip64v2').show();
                if(json.ip64v2_data.length>=dividedby){
                    var html = '';
                    html+='<br>';
                    html+='<p>ip64v2 Ramdom ip 分成每'+dividedby+'個一組:</p>';
                    var ip64randcount = 1;
                    var ip64_6_group_start = 0;
                    var temp_ip64_6='';
                    for(var idx in json.ip64v2_data){
                        temp_ip64_6+=json.ip64v2_data[idx];
                        if(ip64randcount%dividedby==0){
                            html+='<textarea rows="6" class="form-control copyip">'+temp_ip64_6+'</textarea><br/>';
                            temp_ip64_6='';
                        }else{
                            temp_ip64_6+='\r\n';
                        }
                        ip64randcount++;
                    }
                    $('#ip64v2_data').html(html);
                }
            }else{
                $('#ip64v2').hide();
            }
            setTimeout(function(){
                $("#ipsModal").modal('show');
            },2000);

            $('.copyip').off('click').on('click',function(){
                var element=$(this);
                element.select();
                document.execCommand("copy");
                $('#copyipalert').html("Copied the text: " + element.val());
                $('#copyipalert').fadeTo(2000, 500).slideUp(500, function(){
                    $("#success-alert").slideUp(500);
                });
            });
        });
    });
});