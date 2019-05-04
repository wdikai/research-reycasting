import {
    Color
} from './color';
import {
    Texture
} from './texture';
import {
    lerp,
    Vector2D
} from '../math/index';

export class Graphics {
    buffer: ImageData;
    zBuffer: Uint16Array;
    constructor(w: number, h: number) {
        this.resize(w, h);
    }

    get width() {
        return this.buffer.width;
    }

    get height() {
        return this.buffer.height;
    }

    apply(context: CanvasRenderingContext2D): void {
        context.putImageData(this.buffer, 0, 0);
        this.buffer = new ImageData(this.width, this.height);
        this.zBuffer.fill(1000000)
    }

    resize(w: number, h: number): void {
        this.buffer = new ImageData(w, h);
        this.zBuffer = new Uint16Array(w * h).fill(10000000);
    }

    drawPixel(x: number, y: number, color: Color, zIndex: number = null): void {
        let position;
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        position = this.width * y + x;

        if (zIndex !== null && this.zBuffer[position] < zIndex) return;
        if (zIndex) this.zBuffer[position] = zIndex;
        position *= 4;

        this.buffer.data[position] = color.red;
        this.buffer.data[position + 1] = color.green;
        this.buffer.data[position + 2] = color.blue;
        this.buffer.data[position + 3] = 255;
    }

    drawLine(x0: number, y0: number, x1: number, y1: number, color: Color, zIndex ? : number) {
        const dx = Math.abs(x1 - x0),
            sx = x0 < x1 ? 1 : -1;
        const dy = Math.abs(y1 - y0),
            sy = y0 < y1 ? 1 : -1;
        let err = (dx > dy ? dx : -dy) / 2;
        while (true) {
            const e2 = err;
            this.drawPixel(x0, y0, color, zIndex);
            if (e2 > -dx) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dy) {
                err += dx;
                y0 += sy;
            }
            if (x0 === x1 && y0 === y1) break;
        }
    }

    drawRect(x: number, y: number, w: number, h: number, color: Color, zIndex ? : number) {
        for (let x1 = x; x1 < x + w; x1++) {
            this.drawLine(x1, y, x1, y + h, color, zIndex);
        }
    }

    drawArc(x, y, r, sAngle = 0, eAngle = 360, color: Color) {
        
    }

    drawTexture(texture: Texture,
                x: number,
                y: number,
                w ? : number,
                h ? : number,
                xClip: number = 0,
                yClip: number = 0,
                wClip ? : number,
                hClip ? : number,
                zIndex ? : number) {
        let xShift = 0;
        let yShift = 0;

        w = w || texture.width;
        h = h || texture.height;
        wClip = wClip || texture.width;
        hClip = hClip || texture.height;

        if(h > this.height) {
            yShift = Math.floor((h - this.height) >> 1);
        }
        if(w > this.width) {
            yShift = Math.floor((w - this.width) >> 1);
        }
        
        for (let yP = yShift; yP < h - yShift; yP++) {
            const yOffset = yP + y;
            for (let xP = xShift; xP < w - xShift; xP++) {
                const xOffset = xP + x;
                const xS = Math.floor(lerp(0, wClip, xP / w));
                const yS = Math.floor(lerp(0, hClip, yP / h));

                const color = texture.getColor(xS + xClip, yS + yClip);
                if (color.alpha) this.drawPixel(xOffset, yOffset, color, zIndex);
            }
        }
    }
}