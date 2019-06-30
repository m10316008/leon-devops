function FL(name) {
    return name.substr(0, 1).toUpperCase() + name.substr(1, name.length - 1);
}

function getBoxId(day) {
    return day + startBox - 1;
}

function clearAllBox() {
    for (let d = 1; d <= lastDay; d++) {
        $("#box" + getBoxId(d)).html("");
    }
}

function showStaff(staffJson, staff_idx) {
    fetch(staffJson + ".json?tt=" + (new Date()).getTime())
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            masterjson.push(myJson);
            fillStaffToBox(staffJson, myJson, staff_idx);
        })
        .catch(function (err) {
            //console.log(err);
            alert("Error : " + staffJson);
        });
}

function fillStaffToBox(staffName, jsonOriginal, staff_idx) {
    let array = [];
    for (let i = 0; i < 32; i++) {
        array[zeroFill(i, 2)] = "";
        //array.push("");
    }
    // console.log('array1:', array);

    // console.log(jsonOriginal);
    let json = jsonOriginal.sort(function (a, b) {
        return a.start > b.start
    });
    // console.log(json);

    for (let i = 0; i < json.length; i++) {
        try {
            let over_night = true;
            let on_duty_moment = moment(json[i].start, 'YYYY-MM-DD HH:mm');
            let off_duty_moment = moment(json[i].end, 'YYYY-MM-DD HH:mm');
            if (on_duty_moment.format('YYYY-MM-DD') == off_duty_moment.format('YYYY-MM-DD')) {
                over_night = false;
            }
            //console.log('over_night:',over_night);
            switch (over_night) {
                case true:
                    try {
                        //for start
                        let raw = json[i].start.split(" ");
                        let rawDate = raw[0].split("-");
                        let width = $('#box' + rawDate[2] * 1).width();
                        //console.log(rawDate);
                        let temp_moment = moment(json[i].start, 'YYYY-MM-DD HH:mm');
                        let start_hour = temp_moment.format("H");
                        let barwidth = ((24 - start_hour) / 24) * 100;
                        //console.log(width);
                        if (rawDate[0] == currentYear && rawDate[1] == currentMonth) {
                            array[rawDate[2]] += '<div style="color: darkgreen;">' + FL(staffName) + " 上班 " + raw[1] + "</div>";
                            array[rawDate[2]] += '<div style="position: relative;float: right;width:100%;"><div style="position: relative;float: right;background-color: ' + color_arr[staff_idx] + ';width: ' + barwidth + '%"><span style="color: darkgray">' + Math.round(barwidth * 100) / 100 + '%</span></div></div>';
                        }
                    } catch (err) {
                        //console.error("fill start error : " + json[i]);
                    }
                    try {
                        //for end
                        let raw = json[i].end.split(" ");
                        let rawDate = raw[0].split("-");
                        let width = $('#box' + rawDate[2] * 1).width();
                        let temp_moment = moment(json[i].end, 'YYYY-MM-DD HH:mm');
                        let start_hour = temp_moment.format("H");
                        let barwidth = (start_hour / 24) * 100;
                        if (rawDate[0] == currentYear && rawDate[1] == currentMonth) {
                            array[rawDate[2]] += '<div style="color: red;">' + FL(staffName) + " 下班 " + raw[1] + "</div>";
                            array[rawDate[2]] += '<div style="position: relative;float: right;width:100%;"><div style="position: relative;float: left;background-color: ' + color_arr[staff_idx] + ';width: ' + barwidth + '%"><span style="color: darkgray">' + Math.round(barwidth * 100) / 100 + '%</span></div></div>';
                        }
                    } catch (err) {
                        //console.error("fill end error : " + json[i]);
                    }
                    break;
                case false:
                    //not overnight
                    try {
                        //for start
                        let raw = json[i].start.split(" ");
                        let rawDate = raw[0].split("-");
                        let width = $('#box' + rawDate[2] * 1).width();
                        //console.log(rawDate);
                        let temp_moment = moment(json[i].start, 'YYYY-MM-DD H:i');
                        let start_hour = on_duty_moment.format("H");
                        let end_hour = off_duty_moment.format("H");
                        let start_str = on_duty_moment.format("HH:mm");
                        let end_str = off_duty_moment.format("HH:mm");
                        let hour_diff = end_hour - start_hour;
                        let barwidth = ((hour_diff) / 24) * 100;
                        let margin = ((start_hour) / 24) * 100;

                        //console.log('barwidth:',barwidth);
                        if (rawDate[0] == currentYear && rawDate[1] == currentMonth) {
                            array[rawDate[2]] += '<div style="color: darkgreen;">' + FL(staffName) + start_str + " - " + end_str + "</div>";
                            array[rawDate[2]] += '<div style="position: relative;float: right;width:100%;"><div style="position: relative;float: left;margin-left:' + margin + '%;background-color: ' + color_arr[staff_idx] + ';width: ' + barwidth + '%"><span style="color: darkgray">' + Math.round(barwidth * 100) / 100 + '%</span></div></div>';
                        }
                    } catch (err) {
                        //console.error("fill start error : " + json[i]);
                    }
                    break;
            }

        } catch (err) {
            console.error("fill start error : " + json[i]);
        }
    }
    //console.log('array:', array);


    for (let d = 1; d <= lastDay; d++) {
        let day_str = zeroFill(d, 2);
        $("#box" + getBoxId(d)).append(array[day_str]);
    }

    //console.log(array);
}

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

async function wait(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            // console.log('wait done');
            resolve(true);
        }, time)
    });
}

async function loadScript(path) {
    let ready = 0;
    return new Promise(resolve => {
        $.getScript(path, function (data, textStatus, jqxhr) {
            /*console.log( data );
            console.log( textStatus );
            console.log( jqxhr.status );*/
            // console.log("Load completed.");
            resolve();
        });
    });
}

async function renderElement(path) {
    return new Promise(resolve => {
        $.get(path, (response) => {
            var res = response;
            resolve(res);
        });
    });
}

let startBox, lastDay, userhour, workdays, masterjson, month, year, currentYear, currentMonth;

function dectohex(num) {
    hexString = num.toString(16);
    if (hexString.length % 2) {
        hexString = '0' + hexString;
    }
    // console.log(hexString);
    return hexString;
}

function color_scale(main_color, scale) {
    var level = 16;
    var max = 255;
    var color = [];
    color.push(parseInt(main_color.substring(1, 3), 16));
    color.push(parseInt(main_color.substring(3, 5), 16));
    color.push(parseInt(main_color.substring(5, 7), 16));
    // console.log(color);
    var output = [];
    var scale_dir = [];
    for (var y = 0; y < scale; y++) {
        var str = '#';
        for (var i = 0; i < color.length; i++) {
            if (y == 0) {
                // console.log(y);
                if (color[i] > (255 / 2)) {
                    //console.log(100/scale);
                    scale_dir[i] = -Math.round(((255 / 2) / (scale + 1)));
                } else {
                    scale_dir[i] = Math.round(((255 / 2) / (scale + 1)));
                }
            } else {
                // console.log('scale_dir:', scale_dir);
                color[i] = color[i] + scale_dir[i];
            }
            str += dectohex(color[i]);
        }
        output.push(str);
        var html = '<div style="width:30px;background-color: ' + str + '">&nbsp;</div>';
        $('#debug').append(html);
    }
    // console.log(output);
    return output;
}

$(document).ready(async function () {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "../css/bootstrap.min.css"
    }).appendTo("head");
    let tableEle = await renderElement('../table.html');
    $('#table_div').html(tableEle);
    let navEle = await renderElement('../nav.html');
    $(navEle).insertBefore('body');

    // console.log('table Ready');
    // console.log('start load js');
    await loadScript('../js/moment.js');
    await loadScript('config.js');
    await loadScript('..//js/lodash.min.js');
    var waiting = await wait(500);
    // console.log('go');
    let parsedUrl = new URL(window.location.href);
    let temp = parsedUrl.pathname.split('/');
    let month_str = temp[2];
    let aDate = moment(month_str, 'YYYYMM', true);
    let isValid = aDate.isValid();
    if (!isValid) {
        month_str = temp[1];
    }
    year = month_str.substr(0, 4);
    month = month_str.substr(4, 2);
    let moment_time = moment(year + '-' + month + '-01', 'YYYY-MM-DD');
    let weekday = moment_time.weekday();
    startBox = weekday + 1;
    currentYear = year * 1;
    currentMonth = month * 1;
    let end_day = moment_time.endOf('month').format('DD');
    lastDay = end_day;
    let group;
    let color_arr = [
        '#91989F',
        '#C1328E',
        '#86C166',
        '#4A225D',
        '#1C1C1C',
        '#74673E',
        '#F05E1C',
        '#5DAC81',
        '#1E88A8',
        '#91989F',
        '#C1328E',
        '#86C166',
        '#4A225D',
        '#1C1C1C',
        '#74673E',
        '#F05E1C',
        '#5DAC81',
        '#1E88A8'
    ];
    masterjson = new Array();
    userhour = {};
    let holidays = {};
    workdays = {};


    $('#year').html(year);
    $('#month').html(month);
    for (let d = 1; d <= lastDay; d++) {
        //$("#box" + getBoxId(d)).html(d);
        $("#box" + getBoxId(d)).css("background-image", "url(../images/n1/" + d + ".png)");
    }
    let extra_day = parseInt(lastDay) + 1
    // console.log('extra_day:', extra_day);
    $("#box" + getBoxId(extra_day)).html("");
    $("#box" + getBoxId(extra_day)).css("background-image", "url(../images/n1/" + 1 + ".png)");

    clearAllBox();
    let staff_idx = 0;
    let promises = [];
    let user_color = [];

    for (let idx in staffList) {
        promises.push(loadJson(staffList[idx]))
        user_color[staffList[idx]] = color_arr[idx]
        userhour[staffList[idx]] = 0;
    }
    masterjson = await Promise.all(promises)
    renderUserhours(masterjson);
    let masterArray = masterRender(masterjson.map((x, i) => ({
        data: x,
        staff: staffList[i]
    })));
    // console.log('masterArray:',masterArray);
    //console.log(staffList.indexOf('cosine'));
    let startbox_idx = startBox;
    //console.log('masterArray:', masterArray);
    for (let idx in masterArray) {
        let day_data = masterArray[idx];
        let box_key = startbox_idx;
        let content = '<div style="width:100%;height:30px;">';
        content += '</div>';
        let ele = $('#box' + box_key);
        ele.append(content);
        for (let idx2 in day_data) {
            let color = user_color[idx2];
            if (!day_data[idx2].length) {
                let content = '<div class="' + idx2 + '" style="width:100%;">';
                content += '<div style="width:100%;">';
                content += '<div style="width: 100%;">&nbsp;</div>';
                content += '</div>';
                content += '<div style="width:100%;">';
                content += '<div style="width: 100%;">&nbsp;</div>';
                content += '</div>';
                content += '</div>';
                ele.append(content);
            } else {
                let datas = day_data[idx2];
                let name = '';
                let bar = '';
                let temp_case = 0;
                // console.log('datas,', datas)
                for (idx3 in datas) {
                    switch (datas[idx3]._case) {
                        case 0:
                            temp_case += 0;
                            break;
                        case 1:
                            temp_case += 1;
                            break;
                        case 2:
                            temp_case += 2;
                            break;
                    }
                }
                // console.log(idx + ' ' + idx2 + ' ' + temp_case);
                let start_hour;
                let width;
                let margin;
                let end_hour;
                let width_end;
                let name_head;
                let name_tail;
                let bar_head, bar_tail;
                let startmintodigit;
                let endmintodigit;
                let max_with;
                let name_middle;
                let width_middle;
                let bar_middle;
                switch (temp_case) {
                    case 0:
                        name += '<div style="width:100%;text-align: center;">' + idx2 + '@' + moment(datas[0].timeSlot.start).format("HHmm") + '-' + moment(datas[0].timeSlot.end).format("HHmm") + '</div>';
                        start_hour = parseInt(moment(datas[0].timeSlot.start).format("HH"));
                        end_hour = parseInt(moment(datas[0].timeSlot.end).format("HH"));
                        startmintodigit = parseInt(moment(datas[0].timeSlot.start).format("m")) / 60;
                        endmintodigit = parseInt(moment(datas[0].timeSlot.end).format("m")) / 60;
                        width = ((end_hour - (start_hour + startmintodigit)) / 24) * 100;
                        // console.log('width:', width);
                        margin = (start_hour + startmintodigit) / 24 * 100;
                        bar += '<div style="100%;"><div style="border-radius: 15px 15px 15px 15px;background-color: ' + color + ';margin-left: ' + margin + '%;width: ' + width + '%;">&nbsp;</div></div>';
                        break;
                    case 1:
                        //just off overnight duty
                        //updated by ting 201910040551 - handle k case: _case 0 and _case 1 on the same day (e.g. <div style="text-align:left;"><span style="border-radius: 0px 15px 15px 0px; display: inline-block; background-color: #4A225D;width: 6.25%;">&nbsp;</span><span style="margin-left: 54.16666666666667%;border-radius: 15px 15px 15px 15px; display: inline-block; background-color: #4A225D;width: 37.5%;">&nbsp;</span></div>)
                        max_with = 100;

                        bar += '<div style="text-align:left;">'
                        for (idx3 in datas) {
                            switch (datas[idx3]._case) {
                                case 1:
                                    name += '<div style="width:50%;text-align: left;">-' + moment(datas[0].timeSlot.end).format("HHmm") + '</div>';
                                    end_hour = parseInt(moment(datas[0].timeSlot.end).format("HH"));
                                    startmintodigit = parseInt(moment(datas[0].timeSlot.start).format("m")) / 60;
                                    endmintodigit = parseInt(moment(datas[0].timeSlot.end).format("m")) / 60;
                                    if (end_hour == 0) {
                                        end_hour = 1;
                                    }
                                    width_head = ((end_hour + endmintodigit) / 24) * 100;
                                    bar_head='<span style="border-radius: 0px 15px 15px 0px; display: inline-block; background-color: ' + color + ';width: ' + width_head + '%;">&nbsp;</span>'
                                    break
                                case 0:
                                name += '<div style="width:100%;text-align: left;">' + idx2 + '@' + moment(datas[idx3].timeSlot.start).format("HHmm") + '-' + moment(datas[idx3].timeSlot.end).format("HHmm") + '</div>';
                                start_hour = parseInt(moment(datas[idx3].timeSlot.start).format("HH"));
                                end_hour = parseInt(moment(datas[idx3].timeSlot.end).format("HH"));
                                startmintodigit = parseInt(moment(datas[idx3].timeSlot.start).format("m")) / 60;
                                endmintodigit = parseInt(moment(datas[idx3].timeSlot.end).format("m")) / 60;
                                width_end = ((end_hour-(start_hour + startmintodigit)) / 24) * 100;
                                end_hour_0 = parseInt(moment(datas[0].timeSlot.end).format("HH"));
                                endmintodigit_0 = parseInt(moment(datas[0].timeSlot.end).format("m")) / 60;
                                width_head_0 = ((end_hour_0 + endmintodigit_0) / 24) * 100;
                                margin = ((start_hour + startmintodigit) / 24 * 100)-((end_hour_0+endmintodigit_0) / 24 * 100);
                                bar_tail='<span style="margin-left: ' + margin + '%;border-radius: 15px 15px 15px 15px; display: inline-block; background-color: ' + color + ';width: ' + width_end + '%;">&nbsp;</span>'
                                break
                            }
                        } 
                        bar_middle=''
                        width_middle = (100 - (width_end||0) - width_head);
                        bar_middle = '<div style="align-items: center;width: ' + width_middle + '%;display: inline-block;">&nbsp;</div>';
                        bar += (bar_head  + bar_tail).replace(/undefined/g,'');
                        bar += '</div>';
                        break;
                    case 2:
                        //just start overnight duty
                        name += '<div style="width:100%;text-align: right;">' + idx2 + '夜@' + moment(datas[0].timeSlot.start).format("HHmm") + '</div>';
                        start_hour = parseInt(moment(datas[0].timeSlot.start).format("HH"));
                        startmintodigit = parseInt(moment(datas[0].timeSlot.start).format("m")) / 60;
                        endmintodigit = parseInt(moment(datas[0].timeSlot.end).format("m")) / 60;
                        width = ((24 - (start_hour + startmintodigit)) / 24) * 100;
                        margin = (start_hour + startmintodigit) / 24 * 100;
                        bar += '<div style="100%;"><div style="border-radius: 15px 0px 0px 15px;background-color: ' + color + ';margin-left: ' + margin + '%;width: ' + width + '%;">&nbsp;</div></div>';
                        break;
                    case 3:
                        //start and overnight duty
                        //name += '<div style="width:100%;text-align: right;">'+idx2+'夜@'+moment(datas[0].timeSlot.start).format("HH")+'</div>';
                        max_with = 100;
                        name_middle = '<div style="align-items: center;width: auto;">&nbsp;</div>';

                        for (idx3 in datas) {
                            switch (datas[idx3]._case) {
                                case 1:
                                    name_head = '<div style="text-align: left;align-items: flex-start;width: auto;">-' + moment(datas[idx3].timeSlot.end).format("HHmm") + '</div>';
                                    end_hour = parseInt(moment(datas[idx3].timeSlot.end).format("HH"));
                                    endmintodigit = parseInt(moment(datas[idx3].timeSlot.end).format("m")) / 60;
                                    if (end_hour == 0) {
                                        end_hour = 1;
                                    }
                                    width_head = ((end_hour + endmintodigit) / 24) * 100;
                                    bar_head = '<div style="border-radius: 0px 15px 15px 0px; width:' + width_head + '%;display: inline-block;background-color: ' + color + ';">&nbsp;</div>';
                                    break;
                                case 2:
                                    name_tail = '<div style="text-align: right;align-items: flex-end;width: auto;">' + idx2 + '夜@' + moment(datas[idx3].timeSlot.start).format("HHmm") + '</div>';
                                    start_hour = parseInt(moment(datas[idx3].timeSlot.start).format("HH"));
                                    startmintodigit = parseInt(moment(datas[idx3].timeSlot.start).format("m")) / 60;
                                    width_end = ((24 - (start_hour + startmintodigit)) / 24) * 100;
                                    bar_tail = '<div style="border-radius: 15px 0px 0px 15px; width: ' + width_end + '%;display: inline-block;background-color: ' + color + ';">&nbsp;</div>';
                                    break;
                            }
                        }
                        width_middle = 100 - width_end - width_head;
                        bar_middle = '<div style="align-items: center;width: ' + width_middle + '%;display: inline-block;">&nbsp;</div>';
                        name += name_head + name_middle + name_tail;
                        // console.log(name)
                        bar += bar_head + bar_middle + bar_tail;
                        break;
                }

                let content = '<div class="' + idx2 + '" style="width:100%;">';
                content += '<div style="width:100%;display: flex; justify-content: space-between;">';
                content += name;
                content += '</div>';
                content += '<div style="width:100%;display: inline-block;">';
                content += bar;
                content += '</div>';
                content += '</div>';
                // console.log(content)
                ele.append(content);
            }
        }
        startbox_idx++;
    }
});

async function loadJson(staffName) {
    return new Promise((resolve => {
        fetch(staffName + ".json?tt=" + (new Date()).getTime()).then(function (response) {
            resolve(response.json());
        });
    }));
}

function renderUserhours(masterjson) {
    for (let idx in masterjson) {
        let data = masterjson[idx]
        for (idx2 in data) {
            let start_time = moment(data[idx2].start);
            let end_time = moment(data[idx2].end);
            let diff = end_time.diff(start_time, 'minutes');
            diff = diff / 60;
            userhour[staffList[idx]] += diff;
            if (workdays[staffList[idx]] == undefined) {
                workdays[staffList[idx]] = 0;
            }
            workdays[staffList[idx]] += 1;
        }
    }
    // console.log('workdays:', workdays);

    for (let idx in staffList) {
        let name = staffList[idx];
        let html = '';
        html += '<tr>';
        html += '<td class="t2td">';
        html += name;
        html += '</td>';
        html += '<td class="t2td">';
        html += userhour[name];
        html += '</td>';
        html += '<td class="t2td">';
        html += workdays[name];
        html += '</td>';
        html += '<td class="t2td">';
        html += lastDay - workdays[name];
        html += '</td>';
        html += '<td class="t2td">';
        html += '<input class="t2td_checkbox" type="checkbox" data-name="' + name + '" checked/>';
        html += '</td>';
        html += '</tr>';
        $('#userhourstbody').append(html);
        $('.t2td_checkbox').off('click').on('click', function () {
            let ele = $(this);
            let name = ele.data('name');
            if (ele.prop("checked")) {
                $('.' + name).show();
            } else {
                $('.' + name).hide();
            }
        });
    }
}

function masterRender(masterjson) {
    let masterArray = new Array();
    for (let i = 0; i < lastDay; i++) {
        masterArray[i] = {};
        for (let obj of masterjson) {
            let data = obj.data;
            const date = i + 1
            const timeSlot_filter = _.filter(data, (x) => {
                const start = moment(x.start)
                const end = moment(x.end)
                const startMonth = start.format('MM') == month
                const endMonth = end.format('MM') == month
                return ((start.date() == date) && startMonth) || ((end.date() == date) && endMonth);
            });
            if (masterArray[i][obj.staff] == undefined) {
                masterArray[i][obj.staff] = new Array()
            }
            for (let timeSlot of timeSlot_filter) {

                let _type = 0;
                switch (moment(timeSlot.start).format('HH')) {
                    case '09':
                        _type = 1;
                        break;
                    case '14':
                        _type = 2;
                        break;
                    case '07':
                        _type = 3;
                        break;
                    case '22':
                        _type = 4;
                        break;
                }

                let _case = 0;
                if (moment(timeSlot.start).format('MMDD') == moment(timeSlot.end).format('MMDD')) {
                    _case = 0; //day shift
                } else if (moment(timeSlot.start).date() == date) {
                    _case = 2; //overnight on duty
                } else if (moment(timeSlot.start).date() < date) {
                    _case = 1; //overnight off duty
                }

                masterArray[i][obj.staff].push({
                    timeSlot,
                    _case,
                    _type
                })

            }
        }




        if (i == (lastDay - 1)) {
            masterArray[i + 1] = {};
            for (let obj of masterjson) {
                let data = obj.data;
                const date = i + 1
                const timeSlot_filter = _.filter(data, (x) => {
                    const end = moment(x.end)
                    const start = moment(x.start)
                    return (start.month() < end.month()) || (start.year() < end.year());
                });
                if (masterArray[date][obj.staff] == undefined) {
                    masterArray[date][obj.staff] = new Array()
                }
                for (let timeSlot of timeSlot_filter) {
                    masterArray[date][obj.staff].push({
                        timeSlot,
                        _case: 1
                    })
                }
            }
        }
    }

    // let masterArray2 = []

    // for (let x of masterArray) {
    //     let masterArray2_x = {}
    //     _.forOwn(x, (y, staff) => {
    //         let masterArray2_y = []
    //         for (let z of y) {
    //             // if(z._case==0)
    //             masterArray2_y.push(z)
    //         }
    //         // if(_.some(masterArray2_y,['_case',0])){
    //         //     masterArray2_y=[_.find(masterArray2_y,['_case',0])]
    //         // }
    //         if (masterArray2_y[staff] == undefined) masterArray2_x[staff] = []
    //         masterArray2_x[staff].push(...masterArray2_y)
    //     })
    //     masterArray2.push(masterArray2_x)
    // }
    // console.log(masterArray2)

    return masterArray
}