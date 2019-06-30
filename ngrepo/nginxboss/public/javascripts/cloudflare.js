function cf_update(){
    $('#loadingDialog').modal('show');
    $('#cf_update').prop('disabled', true);
    let url = 'cloudflare/update';
    $.get(url,function(json){
        console.log(json);
        $('#cf_update').prop('disabled', false);
        render_table();
        $('#loadingDialog').modal('hide');
    });
}
function render_table(){
    let url = 'cloudflare/render_table';
    let $target = $('#cf_tbody');
    $.get(url,function(json){
        $target.html('');
        for(idx in json){
            let source = document.getElementById('cf_tr_hbs').innerHTML;
            let template = Handlebars.compile(source);
            let html = template(json[idx]);
            $target.append(html);
        }
        init_action();
    });
}

function init_action(){
    $('.action').each(function(){
        let $this = $(this);
        let action_case = $this.data('action_case');
        let domain = $this.data('domain');
        $this.off('click').on('click',function(){
            switch(action_case){
                case 'update_vcode':
                    $('#brandform_domain').val(domain);
                    $('#brandformModal').modal('show');
                    break;
                case 'purge':
                    let data ={
                        domain:domain,
                        action_case:action_case
                    };
                    let url = 'cloudflare/api';
                    $.post(url,data,function(json){
                        console.log(json);
                    });
                    break;
            }
            return false;
        });
    });
}

$(document).ready(function () {
    render_table();
    $('#btnSelectBrand').on('click',function(){
        $('#brandform').submit();
    });
    var validate = $('#brandform').validate({
        rules:{
            vcode:{
                required:true
            }
        },
        submitHandler:function(form){
            $('#brandform').ajaxSubmit(function(json){
                render_table();
                $('#brandformModal').modal('hide');
                document.getElementById("brandform").reset();
            });
        }
    });
});