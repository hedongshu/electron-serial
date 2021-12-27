import { Ref, ref } from 'vue'
import { IPortData, IReceivedData } from '../../../types'


export class Serial {
    public serialDatas: Ref<IReceivedData[]>
    public ports: Ref<string[]>
    public isOpen: Ref<boolean>
    static _instance: Serial

    constructor() {
        this.serialDatas = ref<any[]>([])
        this.ports = ref<string[]>([])
        this.isOpen = ref(false)  // 串口打开状态
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new Serial()
        }
        return this._instance
    }


    public bindListener() {
        window.ipcRenderer.on('serial-data', (event, arg) => {

            this.serialDatas.value.push(JSON.parse(arg));
        });

        window.ipcRenderer.on('serial-opened', (event, arg) => {
            if (arg == 'opened') {
                this.isOpen.value = true
            }
        })
    }



    onClose(func: Function) {
        window.ipcRenderer.on('serial-closed', () => {
            console.log('serial-closed')
            this.isOpen.value = false
            func()
        });
    }

    onError(func: Function) {
        window.ipcRenderer.on('serial-error', (_, arg) => {
            console.log(arg)

            func(arg)
        });
    }

    connect(opt: IPortData) {
        window.ipcRenderer.send('serial-connect', JSON.stringify(opt));
    }

    async sendCommand(command: IsendMsgType) {
        const req = await window.ipcRenderer.invoke('send-command', command);
        console.log('req', req)
    }


    async disconnect() {
        await window.ipcRenderer.invoke('serial-disconnect')
        this.isOpen.value = false
    }

    async refreshList() {
        let result = await window.ipcRenderer.invoke('serial-refresh-ports');
        this.ports.value = JSON.parse(result);
    }



    readFile(title: any, method: string, filters: any) {
        const dialog = window.dialog;

        dialog.showOpenDialog({
            title: title,
            properties: ['multiSelections'],
            filters: filters
        }).then((result) => {
            if (result.canceled) {
                return;
            }
            // 创建可读流
            let readStream = window.fs.createReadStream(result.filePaths[0], {
                flags: 'r',       // 设置文件只读模式打开文件
                encoding: 'utf8'  // 设置读取文件的内容的编码
            });
            // 打开文件流的事件。
            readStream.on('open', fd => {
                console.log('文件可读流已打开，句柄：%s', fd);
            });
            // 可读流打开后，会源源不断的触发此事件方法，回调函数参数就是读取的数据。
            readStream.on('data', data => {
                if (method === 'loadOptions') {
                    if (data) {
                        let option = JSON.parse(data.toString());
                    }
                } else {
                }
            });
            readStream.on('close', () => {
                console.log('文件可读流结束！');
            });
        }).catch((err: any) => {
            console.log(err)
        })
    }
    writeFile(title: any, data: any, filters: any) {
        const dialog = window.dialog;
        dialog.showSaveDialog({
            title: title,
            filters: filters
        }).then((result) => {
            if (result.canceled) {
                return;
            }
            // 创建一个可以写入的流，写入到文件 output.txt 中

            if (result.filePath) {
                const writerStream = window.fs.createWriteStream(result.filePath);
                // 使用 utf8 编码写入数据
                writerStream.write(data);
                // 标记文件末尾
                writerStream.end();
                // 处理流事件 --> data, end, and error
                writerStream.on('finish', () => {
                    console.log("写入完成。");
                });
                writerStream.on('error', (err) => {
                    console.log(err.stack);
                });
            }

        }).catch((err: any) => {
            console.log(err)
        })
    }
}