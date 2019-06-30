$(document).ready(function () {
    console.log('rental ready');
    $('#search_all').on('click',function(){
        render_debt_table();
    });
    $('#search_by_ip').on('click',function(){
        $('#formSearchByIp_ips').val('');
        $('#formSearchByIpModal').modal('show');
        $('#formSearchByIpModalResult').hide();
        $('#unknownSuggestion').hide();
        $('#openMachineList').hide();
    });
    $('#formSearchByIp_analyze').on('click',function(){
        $('#formSearchByIpModalResult').hide();
        $('#unknownSuggestion').hide();
        $('#openMachineList').hide();
        $('#formSearchByIp').submit();
        $('#formSearchByIpMcodes').val('');
    });
    $('#openMachineList').on('click',function(){
        window.open('/support/machine');
    });
    var formSearchByIpValidator = $('#formSearchByIp').validate({
        rules:{
            formSearchByIp_ips:{
                required:true
            }
        },
        submitHandler:function(){
            $('#formSearchByIp').ajaxSubmit(function(json){
                var ip_list = json.ip_list;
                let $target = $('#tbody_results');
                $target.html('');
                var ip_list = json.ip_list;
                var mcodes = new Array();
                var unknownCount = 0;
                for(idx in ip_list){
                    let source = document.getElementById('ip-tmpl').innerHTML;
                    let template = Handlebars.compile(source);
                    let html = template(ip_list[idx]);
                    $target.append(html);
                    if(ip_list[idx].mcode !='UNKNOWN'){
                        if(mcodes.indexOf(ip_list[idx].mcode)== -1){
                            mcodes.push(ip_list[idx].mcode);
                        }
                    }else{
                        unknownCount++;
                    }
                }
                if(unknownCount>=1){
                    $('#unknownSuggestion').show();
                    $('#openMachineList').show();
                }
                $('#formSearchByIpModalResult').show();
                $('#formSearchByIpMcodes').val(JSON.stringify(mcodes));
            });
            return false;
        }
    });
    $('#searchCardByMcode').on('click',function(){
        var options = {
            mcodes:$('#formSearchByIpMcodes').val()
        };
        $('#formSearchByIpModal').modal('hide');
        render_debt_table(options);
    });
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd'
    });
    var options = {
        mcodes:$('#formSearchByIpMcodes').val()
    };
    render_debt_table(options);
    $('#complete_payment').on('click',function(){
        $('#formMachine').submit();
    });
    var validator = $('#formMachine').validate({
        rules:{
            payDate:{
                required:true
            }
        },
        submitHandler:function(){
            console.log('submit now');
            $('#formMachine').ajaxSubmit(function(json){
                alert('Payment complete');
                $("#formModal").modal('hide');
                var options = {
                    mcodes:$('#formSearchByIpMcodes').val()
                };
                render_debt_table(options);
            });
            return false;
        }
    })
});
function render_debt_table(options){
    var url = 'debt/api';
    var data={
        action:'render_debt_table',
        options:options
    };
    $('#loadingDialog').modal('show');
    $.post(url,data,function(json){
        setTimeout(function(){
            $('#loadingDialog').modal('hide');
            }, 1000);
        var cards = json.cards;
        let $target = $('#card-container');
        $target.html('');
        for(idx in cards){
            let source = document.getElementById('debt-card').innerHTML;
            let template = Handlebars.compile(source);
            let html = template(cards[idx]);
            $target.append(html);
        }
        $('.btn_payment').off('click').on('click',function(){
            var options = $(this).data('options');
            show_paymentform(options);
        });
    });
}
function show_paymentform(options){
    document.getElementById("formMachine").reset();
    $('#mcode').val(options.mcode);
    $('#vcode').val(options.vcode);
    $('#firstPayment').val(options.firstPayment);
    $('#rentalStart').val(options.rentalStart);
    $('#rentalEnd').val(options.rentalEnd);
    $('#remarktag').val(options.remarktag);
    $('#payDate').val('');
    $('#price').val(options.price);
    $('.datepicker').datepicker('update');
    $("#formModal").modal('show');
}
hbs = Handlebars;
var blocks = {};
hbs.registerHelper('extend', function (name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
    block.push(context.fn(this));
});

hbs.registerHelper('block', function (name) {
    var val = (blocks[name] || []).join('\n');
    blocks[name] = []; // clear the block
    return val;
});

hbs.__switch_stack__ = [];
hbs.registerHelper("switch", function (value, options) {
    hbs.__switch_stack__.push({
        switch_match: false,
        switch_value: value
    });
    var html = options.fn(this);
    hbs.__switch_stack__.pop();
    return html;
});
hbs.registerHelper("case", function (value, options) {
    var args = Array.from(arguments);
    var options = args.pop();
    var caseValues = args;
    var stack = hbs.__switch_stack__[hbs.__switch_stack__.length - 1];

    if (stack.switch_match || caseValues.indexOf(stack.switch_value) === -1) {
        return '';
    } else {
        stack.switch_match = true;
        return options.fn(this);
    }
});
hbs.registerHelper("default", function (options) {
    var stack = hbs.__switch_stack__[hbs.__switch_stack__.length - 1];
    if (!stack.switch_match) {
        return options.fn(this);
    }
});