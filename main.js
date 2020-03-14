// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, screen} = require('electron')
const path = require('path')

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    y: 0,
    x: width - 100,
    width: 100,
    minWidth: 100,
    minHeight: 200,
    height: height,
    show: false,
    // frame: false,
    // resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./mainWindow/mainWindow.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', function () {
    mainWindow.show()
    console.log('hello')
  })

  // const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  // Menu.setApplicationMenu(mainMenu)
}

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'fuck',
      }
    ]
  }
]

process.platform === 'darwin' ? mainMenuTemplate.unshift({label: ''}) : {}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
