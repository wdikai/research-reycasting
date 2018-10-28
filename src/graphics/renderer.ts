import { Color } from "./color";

declare type CanvasImageSource = any;

interface Shape2D {
    x: number;
    y: number;

    width: number;
    heigh: number;

    zIndex: number;

    hasShade: boolean;

    draw(graphics: CanvasRenderingContext2D): void;
}

class FilledRectangle implements Shape2D {
    x: number;
    y: number;
    width: number;
    heigh: number;
    zIndex: number;
    hasShade: boolean;
    color: Color;

    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.heigh = data.heigh;
        this.hasShade = data.hasShade;
        this.zIndex = data.zIndex;
        this.color = data.color;
    }

    draw(graphics: CanvasRenderingContext2D): void {
        graphics.fillStyle = this.color.toString();
        graphics.fillRect(this.x, this.y, this.width, this.heigh);
    }
}

class Texture2D implements Shape2D {
    x: number;
    y: number;
    width: number;
    heigh: number;
    zIndex: number;
    hasShade: boolean;
    clipX: number;
    clipY: number;
    clipWidth: number;
    clipHeigh: number;
    image: CanvasImageSource;

    constructor(data) {
        this.image = data.image;
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.heigh = data.heigh;
        this.zIndex = data.zIndex;
        this.hasShade = data.hasShade;
        this.clipX = data.clipX;
        this.clipY = data.clipY;
        this.clipWidth = data.clipWidth;
        this.clipHeigh = data.clipHeigh;
    }

    draw(graphics: CanvasRenderingContext2D): void {
        graphics.drawImage(
            this.image,
            this.clipX !== undefined ? this.clipX : this.x,
            this.clipY !== undefined ? this.clipY : this.y,
            this.clipWidth !== undefined ? this.clipWidth : this.width,
            this.clipHeigh !== undefined ? this.clipHeigh : this.heigh,
            this.x,
            this.y,
            this.width,
            this.heigh,
        );
    }
}

export class BufferRenderer {
    private buffer: Shape2D[];
    private graphics: CanvasRenderingContext2D;

    private color: Color;
    private hasShade: boolean;
    private zIndex: number;
    private maxZIndex: number

    constructor(graphics: CanvasRenderingContext2D, maxZIndex: number = Infinity) {
        this.buffer = [];
        this.graphics = graphics;
        this.maxZIndex = maxZIndex;
    }

    setShadeMode(hasShade: boolean) {
        this.hasShade = hasShade;
    }

    setColor(color: Color): void {
        if (color) {
            this.color = color;
        }
    }

    setZIndex(zIndex: number): void {
        this.zIndex = zIndex;
    }

    fillRect(x: number, y: number, width: number, heigh: number): void {
        const { color, zIndex, hasShade } = this;

        this.buffer.push(new FilledRectangle({
            x: Math.floor(x),
            y: Math.floor(y),
            width: Math.floor(width),
            heigh: Math.floor(heigh),
            color,
            zIndex,
            hasShade
        }));
    }

    drawImage(image: CanvasImageSource, x: number, y: number, width?: number, heigh?: number, clipX?: number, clipY?: number, clipWidth?: number, clipHeigh?: number): void {
        const { zIndex, hasShade } = this;

        this.buffer.push(new Texture2D({
            image,
            x: Math.floor(x),
            y: Math.floor(y),
            width: width && Math.floor(width),
            heigh: heigh && Math.floor(heigh),
            zIndex,
            clipX: clipX && Math.floor(clipX),
            clipY: clipY && Math.floor(clipY),
            clipWidth: clipWidth && Math.floor(clipWidth),
            clipHeigh: clipHeigh && Math.floor(clipHeigh),
            hasShade
        }));
    }

    render() {
       this.graphics.imageSmoothingEnabled = false;
        this.buffer
            .filter(operation => operation.zIndex < this.maxZIndex)
            .sort((firstOperation, secondOperation) => secondOperation.zIndex - firstOperation.zIndex)
            .forEach(operation => {
                operation.draw(this.graphics);

                if(operation.hasShade) {
                    this.graphics.fillStyle = "#000000";
                    this.graphics.globalAlpha = 1 - (1 - (operation.zIndex / this.maxZIndex));
                    this.graphics.fillRect(operation.x, operation.y, operation.width, operation.heigh);
                    this.graphics.globalAlpha = 1;
                }
            });

        this.buffer = [];
    }
}