const {app, BrowserWindow} = require('electron')
//const app = require('electron')
//const BrowserWindow = require('electron')
const {session} = require('electron')
const path = require('path')
const url = require('url')
const electron = require('electron')

const fs = require('fs')
const os = require('os')
const ipc = electron.ipcMain
const shell = electron.shell
const dialog = electron.dialog;

let win

function createWindow () {
	//win = new BrowserWindow({width: 700, height: 600})
	win = new BrowserWindow();
	win.maximize();

	win.loadURL(url.format({

	pathname: path.join(__dirname, 'index.html'),
	protocol: 'file:',
	slashes: true

	}))

	//win.webContents.openDevTools()

	win.on('closed', () => {

	win = null

	})

}
app.on('ready', createWindow)

app.on('window-all-closed', () => {

	if (process.platform !== 'darwin') {
		app.quit()
	}
})
app.on('activate', () => {

	if (win === null) {
		createWindow()
	}
})

ipc.on('print-to-pdf', function(event){
	const pdfPath = path.join(app.getPath("desktop"), 'Issued_Recommendations.pdf');
	const win = BrowserWindow.fromWebContents(event.sender);
	var userChosenPath = dialog.showSaveDialog({defaultPath: pdfPath});

	win.webContents.printToPDF({}, function(error, data){
		if (error) return  console.log(error.message);
		fs.writeFile(userChosenPath, data, function(err){
			if (err) return console.log(err.message);
			shell.openExternal('file://'+userChosenPath);
			event.sender.send('wrote-pdf', userChosenPath);
		})
	})

});