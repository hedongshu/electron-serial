import os from 'os'
import path from 'path'
import { app, BrowserWindow, contextBridge, ipcMain, Menu, MenuItemConstructorOptions, shell } from 'electron'
import { SerialCommunication } from './serial'

// https://stackoverflow.com/questions/42524606/how-to-get-windows-version-using-node-js
const isWin7 = os.release().startsWith('6.1')
if (isWin7) app.disableHardwareAcceleration()

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null
const serial = new SerialCommunication()

let menuTemplate: Array<(MenuItemConstructorOptions)> = [
    {
        label: '文件',
        role: 'fileMenu',
        submenu: [
            {
                label: '保存接收数据',
                accelerator: 'Ctrl + S',
                click: function () {
                    (win as BrowserWindow).webContents.send('writeFile');
                }
            },
            {
                label: '读取文件数据',
                accelerator: 'Ctrl + L',
                click: function () {
                    (win as BrowserWindow).webContents.send('readFile');
                }
            }
            ,
            {
                label: '保存配置信息',
                accelerator: 'Ctrl + 1',
                click: function () {
                    (win as BrowserWindow).webContents.send('saveOptions');
                }
            },
            {
                label: '加载配置文件',
                accelerator: 'Ctrl + 2',
                click: function () {
                    (win as BrowserWindow).webContents.send('loadOptions');
                }
            },
            {
                label: '关闭',
                accelerator: 'Ctrl + W',
                click: function () {
                    app.quit();
                }
            }
        ]
    },
    {
        label: '视图',
        role: 'viewMenu',
        submenu: [
            {
                label: '刷新端口列表',
                accelerator: 'Ctrl + R',
                click: function () {
                    (win as BrowserWindow).webContents.send('reloadPorts');
                }
            }
        ]
    },
    {
        label: '帮助',
        role: 'help',
        accelerator: 'Ctrl + H',
        submenu: [
            {
                label: '问题反馈',
                click: function () {
                    shell.openExternal('https://github.com/rymcu/nebula-helper/issues')
                }
            },
            {
                label: '关于我们',
                click: function () {
                    shell.openExternal('https://rymcu.com')
                }
            }
        ]
    }
]

async function bootstrap() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            webSecurity: false,
            contextIsolation: true, // workaround to allow use with Electron 12+
            preload: path.join(__dirname, '../preload/index.cjs'),
        },
    })

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, '../renderer/index.html'))
    } else {
        const pkg = await import('../../package.json')
        const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`

        win.loadURL(url);
        win.maximize();
        (win as BrowserWindow).webContents.openDevTools()
    }

}
app.whenReady().then(bootstrap)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') {
        app.quit()
    }
    serial.close()
})

app.on('second-instance', () => {
    if (win) {
        // someone tried to run a second instance, we should focus our window.
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

// receive events from the renderer process
ipcMain.on('serial-connect', async (channel, arg) => {
    if (serial.isOpen()) {
        await serial.close();
    }
    serial.open(JSON.parse(arg), channel);
});

ipcMain.on('serial-disconnect', () => serial.close());

ipcMain.on('serial-refresh-ports', (channel) => serial.loadPorts(channel));
// @TODO
// auto update
/* if (app.isPackaged) {
  app.whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) =>
      // maybe you need to record some log files.
      console.error('Failed check update:', e)
    )
} */
