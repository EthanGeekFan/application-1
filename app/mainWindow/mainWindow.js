const $ = require('jquery')
const { ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')

var confPath = (require("electron").app || require('electron').remote.app).getPath('userData')

// Load notifications:

var notiFileExists = fs.existsSync(path.join(confPath, 'notifications.json'))

var notificationFile
var notificationList

function readNotiFile() {
    notiFileExists = fs.existsSync(path.join(confPath, 'notifications.json'))
    if (notiFileExists) {
        notificationFile = JSON.parse(fs.readFileSync(path.join(confPath, 'notifications.json')))
    } else {
        notificationFile = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/notifications.json')))
    }
    notificationList = notificationFile['notifications']
}

readNotiFile()

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

    checkNotifications()
}

setInterval(updateClock, 500)

function checkTime(num) {
    if (num < 10) {
        num = '0' + num
    }
    return num
}

function checkNotifications() {
    for (let i = 0; i < notificationList.length; i++) {
        const notiItem = notificationList[i];
        var time = new Date(notiItem.time)
            // console.log(new Date() - time)
        if (-500 < time - new Date() && time - new Date() < 500) {
            let notification = new Notification('下课提醒', {
                body: '歪？老师吗？好像该下课了！'
            })
            console.log(time - new Date())
            notificationList.splice(i, 1)
            fs.writeFileSync(path.join(confPath, 'notifications.json'), JSON.stringify(notificationFile))
            readNotiFile()
            console.log(notificationList.length)
        }
    }
}


// schedule functionality

var scheduleElement = document.getElementById('schedule')
var scheduleData

function getSchedule() {
    // ipcRenderer.send('getSchedule')
    $.ajax({
        url: 'http://www.room923.cf/app/api/getSchedule/?weekday=' + (new Date().getDay() + 1),
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


// notification functionality

ipcRenderer.on('notification:new', (e, time) => {
    // console.log(time)
    let notification = new Notification('Notification Added Successfully', {
        body: 'You will be notified on ' + time.replace(/T/, ' ') + '. '
    })
    var newNotiItem = {
        time: time,
        title: '',
        message: '',
        repeat: false
    }
    console.log(notificationList.length)
    notificationList.push(newNotiItem)
    fs.writeFileSync(path.join(confPath, 'notifications.json'), JSON.stringify(notificationFile))
    readNotiFile()
    console.log(notificationList.length)
})