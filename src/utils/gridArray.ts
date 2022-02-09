function dec2bin(dec: number, length = 8){
    return `${new Array(length).fill('0').join('')}${(dec >>> 0).toString(2)}`.slice(-length);
}
function bin2dec(bin: string){
    return parseInt(bin, 2);
}
export class GridArray {
    row: number;
    col: number;
    length: number;
    buffer: Uint8Array;
    constructor(row = 1, col = 1, length = 1) {
        this.row = Math.max(Math.floor(row), 1);
        this.col = Math.max(Math.floor(col), 1);
        this.length = length;
        this.buffer = new Uint8Array(Math.ceil(row * col * length / 8));
    }
    forEach(cb: (value: number, x: number, y: number) => unknown){
        this.buffer.reduce((pre, item, index) => {
            const binStr = `${pre}${dec2bin(item)}`;
            for (let i = 0; i * this.length < binStr.length; i++) {
                const point = this.offsetToPoint({count: index, i: i * this.length});
                if (point.x > this.col - 1 || point.y > this.row - 1) {
                    break;
                }
                if ((i + 1) * this.length > binStr.length) {
                    return binStr.slice(i * this.length);
                }
                cb(bin2dec(binStr.slice(i * this.length, (i + 1) * this.length)), point.x, point.y);
            }
            return '';
        }, '');
    }
    pointToOffset(point: {x: number, y: number}) { // 起始点
        const index = (point.y * this.col + point.x) * this.length;
        return {
            count: Math.floor(index / 8),
            i: index % 8
        }
    }
    offsetToPoint(offset: {count: number, i: number}) {
        const index = Math.floor((offset.count * 8 + offset.i) / this.length);
        return {
            y: Math.floor(index / this.col),
            x: index % this.col
        }
    }
    toString() {
        let str = '';
        let row = 0;
        this.forEach((value, x, y) => {
            if (y !== row) {
                str += '\n';
                row = y
            }
            str += value;
        });
        return str;
    }
    setPoint(point: {x: number, y: number}, value: number) {
        const offset = this.pointToOffset(point);
        let targetCut = dec2bin(value, this.length);
        let orginBin = '';
        for (let i = offset.count; i < this.buffer.length; i++) {
            orginBin += dec2bin(this.buffer[i]);
            if (orginBin.length >= offset.i + this.length) {
                break;
            }
        }
        let targetBin = '';
        for (let i = 0 ; i < orginBin.length; i++) {
            if (i < offset.i || i >= offset.i + this.length) {
                targetBin += orginBin[i];
            }
            else {
                targetBin += targetCut[i - offset.i];
            }
            if (i % 8 === 7) {
                this.buffer[Math.floor(i / 8) + offset.count] = bin2dec(targetBin.slice(i - 7, i+1));
            }
        }
        
    }
    getPoint(point: {x: number, y: number}) {
        const offset = this.pointToOffset(point);
        let bin = ''
        for (let i = offset.count; i < this.buffer.length; i++) {
            bin += dec2bin(this.buffer[i]);
            if (bin.length >= offset.i + this.length) {
                break;
            }
        }
        return bin2dec(bin.slice(offset.i * this.length, (offset.i + 1) * this.length));
    }
}
