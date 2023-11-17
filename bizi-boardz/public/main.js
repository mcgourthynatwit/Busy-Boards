const { app, BrowserWindow } = require('electron')

//require('@electron/remote/main').initialize()

function createWindow(){
    const win = new BrowserWindow({
        icon: 'icon.ico',
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            enableRemoteModule: true
        }
    })
    win.maximize()
    win.loadURL('http://localhost:3000')
}

app.on('ready', createWindow)


app.on('window-all-closed', function(){


    if (process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', function(){


    if (BrowserWindow.getAllWindows().length == 0) createWindow()
})
