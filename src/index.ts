import {GridArray, rgb2Hsl} from './utils';

export default function factory (option: Option) {
    return new Promise<ConsoleASCII>((resolve, reject) => {
        const ca = new ConsoleASCII(option);
        ca.onload = () => {
            resolve(ca);
        };
        ca.onerror = error => {
            reject(error);
        };
    });
};

class ConsoleASCII {
    canvas: HTMLCanvasElement;
    option: Option;
    gridCell!: number;
    gridSide!: [number, number];
    grid!: GridArray;
    gridBeta!: Array<number[]>;
    chartSet: string[];

    constructor(option: Option) {
        this.canvas = document.createElement('canvas');
        this.option = {...option};
        this.chartSet = option.chartSet || [' ', '.', '-', '#', 'o', '@', '▆', '▇', '█'];
        if (this.option.type === 'image') {
            this.#initImage()
        }
        else {
            this.#initText()
        }
        if (DEBUG) {
            document.body.appendChild(this.canvas);
        }
    }

    #initImage() {
        if (this.option.type !== 'image') {
            return;
        }
        const {scale = 1, imageSrc} = this.option;
        const image = new Image();
        image.src = imageSrc;
        image.crossOrigin = 'Anonymous';
        image.onload = () => {
            const width = image.width * scale;
            const height = image.height * scale;
            this.canvas.width = width;
            this.canvas.height = height;
            const ctx = this.canvas.getContext('2d');
            ctx!.drawImage(image, 0, 0, width, height);
            this.#gridCheck();
        };
        image.onerror = err => {
            if (typeof this.onerror === 'function') {
                this.onerror(err);
            }
        };
    }

    #initText() {
        if (this.option.type !== 'text') {
            return;
        }
        const {
            fontFamily = '"Trebuchet MS", "Heiti TC", "微軟正黑體", "Arial Unicode MS", "Droid Fallback Sans", sans-serif',
            fontWeight = 'normal',
            fontSize = 30,
            text = 'hello world'
        } = this.option;
        const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        const ctx = this.canvas.getContext('2d');
        ctx!.font = font;
        const {width: textWidth} = ctx!.measureText(text);
        const textHeight = Math.max(
            ctx!.measureText('m').width,
            ctx!.measureText('\uFF37').width
        );
        this.canvas.width = textWidth;
        this.canvas.height = textHeight;
        ctx!.fillStyle = 'hsl(360, 100%, 100%)';
        ctx!.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx!.font = font;
        ctx!.fillStyle = 'hsl(360, 0%, 0%)';
        ctx!.textBaseline = 'middle'
        ctx!.fillText(text, 0, fontSize * .5);
        Promise.resolve().then(() => {
            this.#gridCheck();
        });
    }

    #gridCheck() {
        const scale = 'scale' in this.option ? this.option.scale || 1 : 1;
        this.gridCell = Math.max(
            Math.ceil(this.canvas.width / scale / 1000),
            Math.ceil(this.canvas.height / scale / 1000),
            2
        );
        
        const horizontal= Math.ceil(this.canvas.width / this.gridCell);
        const vertical = Math.ceil(this.canvas.height / this.gridCell);
        this.gridSide = [horizontal - 1, vertical - 1];
        this.grid = new GridArray(vertical, horizontal, (this.chartSet.length - 1).toString(2).length);
        // this.gridBeta = new Array(vertical).fill(null).map(() => new Array(horizontal).fill(0));
        const ctx = this.canvas.getContext('2d');
        const pixel = ctx!.getImageData(0, 0, horizontal * this.gridCell, vertical * this.gridCell).data;

        // 遍历每个网格、每个像素、每个RGBA
        for (let gridY = 0; gridY <= this.gridSide[1]; gridY++) {
            for (let gridX = 0; gridX <= this.gridSide[0]; gridX++) {
                const lightList: number[] = [];
                singleGridLoop: for (let y = 0; y < this.gridCell; y++) {
                    for (let x = 0; x < this.gridCell; x++) {
                        const offsetX = gridX * this.gridCell + x;
                        const offsetY = gridY * this.gridCell + y;
                        if (offsetX > this.canvas.width - 1 || offsetY > this.canvas.height - 1 ) {
                            break singleGridLoop;
                        }
                        const pixelIndex = offsetY * horizontal * this.gridCell + offsetX;

                        // 亮度
                        const {l} = rgb2Hsl([
                            pixel[pixelIndex * 4 + 0],
                            pixel[pixelIndex * 4 + 1],
                            pixel[pixelIndex * 4 + 2],
                        ]);

                        // rgb平均
                        // const l = (pixel[pixelIndex * 4 + 0]
                        //     + pixel[pixelIndex * 4 + 1]
                        //     + pixel[pixelIndex * 4 + 2])
                        //     / (3 * (Math.pow(2, 8) - 1));

                        // 加权平均
                        // const l = (0.299 * pixel[pixelIndex * 4 + 0] + 0.587 * pixel[pixelIndex * 4 + 1] + 0.114 * pixel[pixelIndex * 4 + 2])
                        //     / (Math.pow(2, 8) - 1);
                        lightList.push(l);
                    }
                }
                const avgL = lightList.reduce((pre, now) => pre + now) / lightList.length;
                
                this.grid.setPoint({x: gridX, y: gridY}, this.chartSet.length - 1 - Math.round(avgL * (this.chartSet.length - 1)));
                // this.gridBeta[gridY][gridX] = this.chartSet.length - 1 - Math.round(avgL * (this.chartSet.length - 1));
            }
        }
        if (typeof this.onload === 'function') {
            this.onload();
        }
    }

    toString() {
        let str = '';
        let row = 0;
        this.grid.forEach((value, x, y) => {
            if (y !== row) {
                str += '\n';
                row = y
            }
            str += this.chartSet[value];
        });
        // this.gridBeta.forEach(list => {
        //     list.forEach(value => {
        //         str += this.chartSet[value];
        //     })
        //     str += '\n';
        // });
        return str;
    }

    onload?(): unknown
    onerror?(err: unknown): unknown
}


