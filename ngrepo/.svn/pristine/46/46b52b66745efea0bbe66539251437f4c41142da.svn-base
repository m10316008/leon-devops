try {
    var moment = require('./moment.js')
    var _ = require('./lodash.min.js')
} catch (e) {

}

const util = {
    async generateWorkJSON({
        selectedMonth,
        workStart,
        workHours,
        checkedArr
    }) {
        let jsonMonthMonent = moment(selectedMonth, 'YYYY-MM');
        let lastday = jsonMonthMonent.endOf('month')
        let lastday_str = lastday.format('D');
        // console.log(lastday_str)
        let startday = jsonMonthMonent.startOf('month');
        let output_arr = new Array();
        let _year = startday.format('YYYY');
        let _month = startday.format('MM');
        let _workhours = parseInt(workHours);
        const isHalf = (workStart % 0.5 == 0)
        // console.log('isHalf',isHalf)
        const con1 = !checkedArr.includes(1) //user checked nothing
        for (let i = 1; i <= lastday_str; i++) {
            let _weekday = startday.isoWeekday();
            const con2 = !!checkedArr[_weekday - 1]
            let _day = this.addTrailingZero(i, 1);
            let _start_moment = moment(_year + '-' + _month + '-' + _day + ' ' + workStart, 'YYYY-MM-DD HH:mm')
            let _end_moment = _.cloneDeep(_start_moment).add(_workhours, 'hours')
            let _end = _end_moment.format('YYYY-MM-DD HH:mm')
            let _start = _start_moment.format('YYYY-MM-DD HH:mm')
            let _obj = {
                start: _start,
                end: _end
            }
            if (con1 || con2)
                output_arr.push(_obj);
            startday.add(1, 'days');
        }
        return JSON.stringify(output_arr)
    },
    addTrailingZero(number, trailingZero) {
        return ('0'.repeat(trailingZero) + number).substring(number.toString().length - trailingZero)
    }
}

try {
    module.exports = util
} catch (e) {
    // console.log(e)
}