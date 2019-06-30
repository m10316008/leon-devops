$(document).ready(function () {
    console.log('start tag');
    $('#myform').validate({
        rules:{
            tag:{
                required:true
            }
        },
        submitHandler:function(form){
            console.log('submit handle');
            $('#myform').ajaxSubmit(function(json){
                alert('Update complete');
                window.location.reload();
                console.log(json);
            });
            return false;
        }
    });
    console.log('end tag');
});