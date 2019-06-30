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
    console.log('prtg ready');
    $('#search').on('keyup', function (k) {
        var $this = $(this);
        if (k.keyCode == 13) {
            render_prtg($this.val())
        }
        /*
        delay(function(){
            console.log('search:',$this.val());

        }, 1000 );*/
    });
    render_prtg('vc3');
    runner();

    $('#show_detail').click(function () {
        $('.hide').toggle('display');
    });
});
var items = [
    'traffic'
];
var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
var charts = new Array();

function update_map() {
    for(idx in charts){
        var chart = charts[idx];
        chart.destroy();
    }
    charts = new Array();
    $('.coscard').each(function () {
        var ele = $(this);
        //console.log('mcode:',ele.data('mcode'));
        var mcode = ele.data('mcode');
        var url = 'prtg/fetchnv';
        $.post(url, {mcode: ele.data('mcode'), items: items}, function (json) {
            if (json.is_dead == '1') {
                $('#card_' + mcode).addClass('prtg-alert');
            } else {
                $('#card_' + mcode).removeClass('prtg-alert');
            }
            var traffic = json.traffic;
            var trafficData = {
                labels: json.labels,
                datasets: [{
                    pointRadius: 0,
                    borderWidth: 2,
                    label: 'In Traffic',
                    borderColor: chartColors.green,
                    backgroundColor: chartColors.green,
                    fill: false,
                    data: json.traffic.intraffic_vals
                }, {
                    pointRadius: 0,
                    borderWidth: 2,
                    label: 'Out Traffic',
                    borderColor: chartColors.red,
                    backgroundColor: chartColors.red,
                    fill: false,
                    data: json.traffic.outtraffic_vals
                }, {
                    pointRadius: 0,
                    borderWidth: 2,
                    label: 'Total Traffic',
                    borderColor: chartColors.blue,
                    backgroundColor: chartColors.blue,
                    fill: false,
                    data: json.traffic.totaltraffic_vals
                }]
            };
            var ctx = document.getElementById('canvas_traffic_' + mcode).getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                data: trafficData,
                options: {
                    responsive: true,
                    hoverMode: 'index',
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Traffic'
                    }
                }
            });
            charts.push(chart);
            var cpu_data = {
                labels: json.labels,
                datasets: [{
                    pointRadius: 0,
                    borderWidth: 2,
                    label: 'Cpu Load',
                    borderColor: chartColors.green,
                    backgroundColor: chartColors.green,
                    fill: false,
                    data: json.cpu
                }]
            };
            var ctx = document.getElementById('canvas_cpu_' + mcode).getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                data: cpu_data,
                options: {
                    responsive: true,
                    hoverMode: 'index',
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Cpu Usage'
                    }
                }
            });
            charts.push(chart);
            var ram_data = {
                labels: json.labels,
                datasets: [{
                    pointRadius: 0,
                    borderWidth: 2,
                    label: 'Ram Free',
                    borderColor: chartColors.green,
                    backgroundColor: chartColors.green,
                    fill: false,
                    data: json.ram_free
                }]
            };
            var ctx = document.getElementById('canvas_ram_' + mcode).getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                data: ram_data,
                options: {
                    responsive: true,
                    hoverMode: 'index',
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Ram Status'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: function (item) {
                                    return (Math.round((item / 1024 / 1024) * 100) / 100) + 'Mb';
                                }
                            }
                        }]
                    }
                }
            });
            charts.push(chart);
            var apps_data = {
                labels: json.labels,
                datasets: [{
                    pointRadius: 0,
                    borderWidth: 2,
                    label: 'Openresty',
                    borderColor: chartColors.red,
                    backgroundColor: chartColors.red,
                    fill: false,
                    data: json.openresty
                }, {
                    pointRadius: 0,
                    borderWidth: 2,
                    label: 'Node188',
                    borderColor: chartColors.green,
                    backgroundColor: chartColors.green,
                    fill: false,
                    data: json.node188
                }]
            };
            var ctx = document.getElementById('canvas_apps_' + mcode).getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
                data: apps_data,
                options: {
                    responsive: true,
                    hoverMode: 'index',
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Apps Status'
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: function (item) {
                                    switch (item) {
                                        case 1:
                                            return 'Active';
                                            break;
                                        case 0:
                                            return 'Failed';
                                            break;
                                    }
                                }
                            }
                        }]
                    }
                }
            });
            charts.push(chart);
        });
    });
}
function runner() {
    setInterval(function () {
        console.log('refresh');
        update_map();
    }, 60 * 1000);
}
function render_prtg(search) {
    var url = 'prtg/render';
    $.post(url, {search: search}, function (json) {
        let $target = $('#prtg-container');
        $target.html('');
        for (idx in json) {
            //console.log('mcode:',json[idx].mcode);
            let source = document.getElementById('prtg-card').innerHTML;
            let template = Handlebars.compile(source);
            let html = template(json[idx]);
            $target.append(html);
        }
        update_map();
    });
}