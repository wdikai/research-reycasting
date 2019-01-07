import {Color} from './color';

export class Texture {
    static load(path: string): Promise <Texture> {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = path;
            image.crossOrigin = "Anonymous"; 
            image.onerror = () => reject(new Error(`Texture ${path} isn't loaded.`));
            image.onload = () => {
                const canvas: HTMLCanvasElement = document.createElement('canvas');
                const context: CanvasRenderingContext2D = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, image.width, image.height);
                const data = context.getImageData(0, 0, canvas.width, canvas.height);

                resolve(new Texture(data));
            };
        });
    }

    private imageData: ImageData;

    constructor(imageData: ImageData) {
        this.imageData = imageData;
    }

    public get width () : number {
        return this.imageData.width;
    }

    public get height () : number {
        return this.imageData.height;
    }

    getColor(x, y): Color {
        const position = x * 4 + y * 4 * this.width;
        return new Color(
            this.imageData.data[position],
            this.imageData.data[position + 1],
            this.imageData.data[position + 2],
            this.imageData.data[position + 3]
        );
    }
}