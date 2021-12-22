
import { ref } from 'vue'
import { IReceivedData } from "./env";
export function useSerial() {
    const ipcRenderer = window.ipcRenderer
    const headers = ref<IReceivedData | null>(null)
    const serialDatas = ref<IReceivedData[]>([])
    const ports = ref('')
    // receive events from the main process
    ipcRenderer.on('serial-data', (_, arg: string) => {
        const data: IReceivedData = JSON.parse(arg);
        if (data.type === 'headers') {
            headers.value = data;
            console.log(headers.value)
        }
        serialDatas.value.push(data);
    });

    ipcRenderer.on('serial-opened', () => {
        serialDatas.value = [];
    });

    ipcRenderer.on('serial-closed', () => {
        console.log('serial-closed')
    });

    ipcRenderer.on('serial-ports', (_, arg) => {
        ports.value = JSON.parse(arg);
    });

    ipcRenderer.on('serial-error', (_, arg) => {
        console.log('serial port error', arg);
    });


    const disconnect = () => {
        ipcRenderer.send('serial-disconnect', '');
    }

    const refreshList = () => {
        ipcRenderer.send('serial-refresh-ports', '');
    }

    return {
        headers, serialDatas, ports, disconnect, refreshList
    }
}