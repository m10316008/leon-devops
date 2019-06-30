const util = require('./util.js')

const test = async () => {
    const res = await util.generateWorkJSON({
        selectedMonth: '2018-12',
        workStart: '09:30',
        workHours: 9,
        checkedArr:[0,0,0,0,0,0,0]
    })
    console.log('res', res)
}

test()