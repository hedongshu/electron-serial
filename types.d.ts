
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production'
        readonly PORT: string
        readonly HOST: string
    }
}

export interface IPortData {
    port: string;
    baudRate: number;
}
export interface IReceivedData extends IPortData {
    timestamp: string;
    type: 'values' | 'headers';
    data: string[];
    raw: string;
}

