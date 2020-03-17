// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, screen, ipcMain } = require('electron')
const path = require('path')

var mainWindow = null
var newNotificationWindow = null
var controlCenterWindow = null

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
        // Create the browser window.
    mainWindow = new BrowserWindow({
        y: 0,
        x: width - 110,
        width: 110,
        minWidth: 110,
        minHeight: 200,
        height: height,
        show: false,
        frame: false,
        // transparent: true,
        // resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'app/mainWindow/mainWindow.html'))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.on('ready-to-show', function() {
        mainWindow.show()
    })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on('closed', function() {
        app.quit()
    })

}

// notification functionality

ipcMain.on('notification:new', (e, time) => {
    mainWindow.webContents.send('notification:new', time)
    newNotificationWindow.close()
})

const mainMenuTemplate = [{
    label: 'Schedule',
    submenu: [{
        role: 'about',
    }, {
        label: 'Check for Updates...',
    }, {
        type: 'separator'
    }, {
        label: 'Preferences',
        accelerator: process.platform == 'darwin' ? 'Cmd+,' : 'Ctrl+,'
    }, {
        type: 'separator'
    }, {
        role: 'services'
    }, {
        type: 'separator'
    }, {
        role: 'hide'
    }, {
        role: 'hideOthers'
    }, {
        label: 'Close Current Window',
        accelerator: process.platform == 'darwin' ? 'Cmd+W' : 'Ctrl+W',
        click: (menuItem, browserWindow, event) => {
            browserWindow.close()
        }
    }, {
        type: 'separator'
    }, {
        role: 'quit'
    }]
}, {
    label: 'Tools',
    submenu: [{
        label: 'New Notification',
        accelerator: process.platform == 'darwin' ? 'Cmd+N' : 'Ctrl+N',
        click: (menuItem, browserWindow, event) => {
            newNotification()
        }
    }, {
        type: 'separator'
    }, {
        label: 'Control Center',
        accelerator: process.platform == 'darwin' ? 'Cmd+M' : 'Ctrl+M',
        click: (menuItem, browserWindow, event) => {
            controlCenter()
        }
    }]
}]


function newNotification() {
    if (newNotificationWindow !== null) {
        newNotificationWindow.show()
    } else {
        newNotificationWindow = new BrowserWindow({
            width: 500,
            height: 300,
            resizable: false,
            // frame: false,
            show: false,
            webPreferences: {
                nodeIntegration: true
            }
        })

        newNotificationWindow.loadFile(path.join(__dirname, 'app/newNotificationWindow/newNotificationWindow.html'))

        newNotificationWindow.on('ready-to-show', function() {
            newNotificationWindow.show()
        })

        newNotificationWindow.on('close', () => {
            newNotificationWindow = null
        })
    }
}


function controlCenter() {
    if (controlCenterWindow !== null) {
        controlCenterWindow.show()
    } else {
        controlCenterWindow = new BrowserWindow({
            width: 1000,
            height: 675,
            resizable: true,
            // frame: process.platform === 'darwin' ? true : false,
            titleBarStyle: "hidden",
            show: false,
            webPreferences: {
                nodeIntegration: true
            }
        })

        controlCenterWindow.loadFile(path.join(__dirname, 'app/controlCenterWindow/controlCenterWindow.html'))

        controlCenterWindow.on('ready-to-show', () => {
            controlCenterWindow.show()
        })

        controlCenterWindow.on('close', () => {
            controlCenterWindow = null
        })
    }
}


// process.platform === 'darwin' ? mainMenuTemplate.unshift({ label: '' }) : {}
process.env.NODE_ENV === 'production' ? {} : mainMenuTemplate.push({
    label: 'Developer',
    submenu: [{
        role: 'toggleDevTools'
    }]
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.