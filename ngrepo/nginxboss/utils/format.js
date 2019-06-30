function twoDigit(num) {
    if (num < 10) {
        return '0' + num;
    }

    return num;
}

function dateTimeObject(date) {
    var obj = {
        yyyy: date.getFullYear(),
        mm: twoDigit(date.getMonth() + 1),
        dd: twoDigit(date.getDate()),
        h: twoDigit(date.getHours()),
        m: twoDigit(date.getMinutes()),
        s: twoDigit(date.getSeconds())
    }

    return obj;
}

exports.dateTimeFormat = function (date) {
    var obj = dateTimeObject(date);
    return obj.yyyy + '-' + obj.mm + '-' + obj.dd + ' ' + obj.h + ':' + obj.m + ':' + obj.s;
}

exports.timeStamp = function (date) {
    var obj = dateTimeObject(date);
    return obj.yyyy + obj.mm + obj.dd + obj.h + obj.m + obj.s;
}

exports.dateStamp = function (date) {
    var obj = dateTimeObject(date);
    return obj.yyyy + obj.mm + obj.dd;
}

exports.sizeFormat = function (size) {
    if (size > 1000000000) {
        return (size / 1000000000).toFixed(2) + ' GB';
    }

    if (size > 1000000) {
        return (size / 1000000).toFixed(2) + ' MB';
    }

    if (size > 1000) {
        return (size / 1000).toFixed(2) + ' KB';
    }

    return size;
}
