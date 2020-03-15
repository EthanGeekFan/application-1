const { ipcRenderer } = require('electron')

var newNotificationForm = document.getElementById('newNotificationForm')
newNotificationForm.addEventListener('submit', submitForm)

function submitForm(e) {
    e.preventDefault()
    const time = document.getElementById('time').value
        // console.log(time)
    ipcRenderer.send('notification:new', time)
}