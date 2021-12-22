
export { }
import serial from 'serialport'



declare global {
    interface Window {
        // Expose some Api through preload script
        fs: typeof import('fs')
        ipcRenderer: import('electron').IpcRenderer
        removeLoading: () => void
        serial: serial
    }
}
