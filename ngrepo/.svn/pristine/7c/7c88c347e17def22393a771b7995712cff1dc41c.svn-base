var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
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
$(document).ready(function () {
    console.log('static-info ready');
    $(function () {
        $('#myTab li:first-child a').tab('show')
    });
    $('.copyip').off('click').on('click',function(){
        var element=$(this);
        element.select();
        document.execCommand("copy");
        $('.msg').html("Copied the text: " + element.val());
        $('.msg').fadeTo(2000, 500).slideUp(500, function(){
            $("#success-alert").slideUp(500);
        });
    });
    $('.copypassword').on('click',function(){
        var $this = $(this);
        var value = $this.data('value');
        var $tempInput =  $("<textarea>");
        $("body").append($tempInput);
        $tempInput.val(value).select();
        document.execCommand("copy");
        $tempInput.remove();
        $('.msg').html("Copied Password!!");
        $('.msg').fadeTo(2000, 500).slideUp(500, function(){
            $("#success-alert").slideUp(500);
        });
    });
    $('.editpassword').on('click',function(){
        var $this = $(this);
        var url = 'static-info/api';
        $.post(url,{
            id:$this.data('id'),
            action:'get_info'
        },function(json){
            if(json.success=='1'){
                console.log('json:',json);
                $('#value').val('*****');
                $('#value1').val('*****');
                $('#id').val(json.info.id);
                $('#type').val(json.info.type);
                $('#remark').val(json.info.remark);
                $('#formModal').modal('show');
            }
        });
    });
    $('#btnUpdate').on('click',function(){
        $('#form').submit();
    });
    var validator = $('#form').validate({
        rules:{
            'value':{
                required:true
            },
            'value1':{
                equalTo:'#value'
            }
        },
        submitHandler:function(form){
            console.log('submit');
            $('#form').ajaxSubmit(function(json){
                //console.log('json',json);
                $('#formModal').modal('hide');
                alert('Update Success');
                window.location.reload();
            });
            return false;
        }
    });
});