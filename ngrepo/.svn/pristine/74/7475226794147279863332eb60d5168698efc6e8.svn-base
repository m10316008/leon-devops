var table;
var draw = 1;
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
$(document).ready(function () {
    table = $('#example').DataTable({
        "searching": false,
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: 'report/api',
            type: "POST",
            data: function (d) {
                d.action = "render_table";
                d.draw = draw
                d.tag = new Array();
                //d.tag[0] = $('#tag_0').val();
                //d.tag[1] = $('#tag_1').val();
                d.search_tag = $('#search_tag').val();
            }
        },
        "drawCallback": function (settings) {
            draw++;
        }
    });

    $('#search_by_tag').on('click', function () {

        var json_str = $('#search_tag').val();
        if(IsJsonString(json_str)){
            console.log(true);
            if (/^[\],:{}\s]*$/.test(json_str.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                render_table();
            } else {
                alert('Invalid Json');
            }
        }else{
            alert('Invalid Json');
        }
    });
});

function render_table() {
    table.ajax.reload(null, false);
    console.log('reload');
}