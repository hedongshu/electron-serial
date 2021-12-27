
export { }
import { BrowserWindow, Dialog } from 'electron'




declare global {
    interface Window {
        // Expose some Api through preload script
        fs: typeof import('fs')
        ipcRenderer: import('electron').IpcRenderer
        removeLoading: () => void
        dialog: Dialog
        BrowserWindow: BrowserWindow
    }
}



