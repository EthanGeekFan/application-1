const $ = require('jquery')

// Clock functionality:

const weekdays = {
    1: '星期日',
    2: '星期一',
    3: '星期二',
    4: '星期三',
    5: '星期四',
    6: '星期五',
    7: '星期六'
}

function updateClock() {
    var dateElement = document.getElementById("date")
    var weekElement = document.getElementById("week")
    var timeElement = document.getElementById("time")
    var now = new Date()
    var month = (now.getMonth() + 1) + '月'
    var date = now.getDate() + '日'
    var week = now.getDay() + 1
    var hour = now.getHours()
    var minute = now.getMinutes()
    var second = now.getSeconds()

    dateElement.innerHTML = month + date
    weekElement.innerHTML = weekdays[week]
    timeElement.innerHTML = checkTime(hour) + ':' + checkTime(minute) + ':' + checkTime(second)
}

setInterval(updateClock, 500)

function checkTime(num) {
    if (num < 10) {
        num = '0' + num
    }
    return num
}


// schedule functionality

var scheduleElement = document.getElementById('schedule')
var scheduleData

function getSchedule() {
    // ipcRenderer.send('getSchedule')
    $.ajax({
        url: 'https://www.room923.cf/app/api/getSchedule/?weekday=' + (new Date().getDay() + 1),
        dataType: 'json',
        success: function(data) {
            scheduleData = data['data']['schedule']
            for (var i = 0; i < scheduleData.length; i++) {
                createItem(i)
            }
        }
    })
};

getSchedule()


function createItem(index) {
    var item = document.createElement('li')
    var text = document.createTextNode(scheduleData[index][0])
        // item.innerHTML = scheduleElement[index]
    item.className = 'item'
    item.id = index
    item.appendChild(text)
    scheduleElement.appendChild(item)
}