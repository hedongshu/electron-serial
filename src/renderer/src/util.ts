export function isGBK(data: number[]) {
    if (data[0] == 0xff && data[1] == 0xfe) {
        console.log('unicode');
        return false;
    } else if (data[0] == 0xfe && data[1] == 0xff) {
        console.log('unicode');
        return false;
    } else if (data[0] == 0xef && data[1] == 0xbb) {
        console.log('utf8');
        return false;
    } else {
        return true;
    }
}


export function strToBinary(str: string, binary: any) {
    let result = [];
    let list = str.split("");
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        let data = item.charCodeAt(0).toString(binary);
        result.push(data);
    }
    return result.join("");
}