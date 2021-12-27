import * as electron from 'electron';
// const SerialPort = require('serialport')
import serialport, { OpenOptions } from 'serialport'
const readline = require('@serialport/parser-readline')
import { IPortData, IReceivedData } from 'types';

export class SerialCommunication {
    private port!: serialport;
    private parser: any;
    public first = true;

    constructor() {
    }

    public async loadPorts() {
        const ports = await serialport.list();
        return JSON.stringify(ports.map((x: { path: any; }) => x.path))
    }

    public async send(req: any) {
        return new Promise((resolve, reject) => {
            if (this.isOpen()) {
                // 发送
                console.log('send', req)
                this.port.write(req.data, req.encoding, (err, result) => {
                    this.first = true
                    if (err) {
                        console.log('Error while sending message : ' + err);
                        reject(err)
                    }
                    if (result) {
                        console.log('Response received after sending message : ' + result);
                        resolve(result)
                    }
                })
            } else {
                reject()
            }
        })

    }

    public open(data: IPortData, event: electron.IpcMainEvent) {
        this.port = new serialport(data.port, {
            baudRate: data.baudRate,
            parity: data.parity,
            dataBits: data.dataBits,
            stopBits: data.stopBits
        }, (err) => {
            if (err) {
                event.reply('serial-error', (err.message));
            }
        });



        this.port.on('open', () => {
            try {
                event.reply('serial-opened', 'opened');
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial port opened"');
            }
        });

        this.port.on('error', (error) => {
            try {
                event.reply('serial-error', JSON.stringify(error.message));
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial port error"');
            }
        });


        this.parser = new readline({ delimiter: '\r\n' });
        this.port.pipe(this.parser);


        this.parser.on('data', (line: string) => {
            const outData: IReceivedData = {
                timestamp: new Date().toISOString(),
                port: data.port,
                baudRate: data.baudRate,
                type: 'values',
                data: line.split(','),
                raw: line
            };
            if (this.first) {
                this.first = false;
                outData.type = 'headers';
                outData.data = line.split(',');
            }
            try {
                event.reply('serial-data', JSON.stringify(outData));
            } catch (err) {
                console.log('IpcMainEvent: failed to respond "serial data"');
            }
        });
    }

    public async close(): Promise<void> {
        if (this.port && this.port.isOpen) {
            return new Promise((resolve, reject) => {
                this.port.close((err: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }

    public isOpen(): boolean {
        return this.port && this.port.isOpen;
    }

}