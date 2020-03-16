const { ipcRenderer } = require('electron')

var now = new Date()
var year = now.getFullYear()
var month = now.getMonth().toString().length === 1 ? '0' + (now.getMonth() + 1).toString() : now.getMonth() + 1
var date = now.getDate().toString().length === 1 ? '0' + (now.getDate()).toString() : now.getDate();
var hours = now.getHours().toString().length === 1 ? '0' + now.getHours().toString() : now.getHours();
var minutes = now.getMinutes().toString().length === 1 ? '0' + now.getMinutes().toString() : now.getMinutes();
var seconds = now.getSeconds().toString().length === 1 ? '0' + now.getSeconds().toString() : now.getSeconds();
var formattedDateTime = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds;
console.log(formattedDateTime)
document.getElementById('time').value = formattedDateTime

var newNotificationForm = document.getElementById('newNotificationForm')
newNotificationForm.addEventListener('submit', submitForm)

function submitForm(e) {
    e.preventDefault()
    const time = document.getElementById('time').value
    ipcRenderer.send('notification:new', time)
}