const { ipcRenderer } = require('electron')
const $ = require('jquery')

// Clock functionality:

const weekdays = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    7: '星期日',
}

function updateClock() {
    var dateElement = document.getElementById("date")
    var weekElement = document.getElementById("week")
    var timeElement = document.getElementById("time")
    var now = new Date()
    var month = (now.getMonth() + 1) + '月'
    var date = now.getDate() + '日'
    var week = now.getDay()
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
        url: 'http://192.168.101.41/app/api/getSchedule/?weekday=' + new Date().getDay(),
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