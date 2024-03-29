import { Color } from "./color";
import { toRudian } from "../math/utils";
import { Graphics } from "./graphics";
import { Texture } from "./texture";
import { Renderer } from "./renderer";

declare type CanvasImageSource = any;

interface Shape2D {
    x: number;
    y: number;

    width?: number;
    heigh?: number;
    zIndex: number;

    hasShade: boolean;

    draw(graphics: Graphics): void;
}

class Arc2D implements Shape2D {
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    width: number;
    zIndex: number;
    hasShade: boolean;
    color: Color;
    filled: boolean;

    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.radius = data.radius;
        this.startAngle = data.startAngle;
        this.endAngle = data.endAngle;
        this.width = data.width;
        this.zIndex = data.zIndex;
        this.color = data.color;
        this.filled = data.filled;
        this.hasShade = false;
    }

    draw(graphics: Graphics): void {
        graphics.drawArc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.color);
    }
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

    draw(graphics: Graphics): void {
        graphics.drawRect(this.x, this.y, this.width, this.heigh, this.color);
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
    image: Texture;

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
    
    draw(graphics1: Graphics): void {

        graphics1.drawTexture(
            this.image,
            this.x,
            this.y,
            this.width,
            this.heigh,
            this.clipX,
            this.clipY,
            this.clipWidth,
            this.clipHeigh,
        );
    }
}

export class BufferRenderer extends Renderer {
    private buffer: Shape2D[];

    constructor(graphics: Graphics, maxZIndex: number = Infinity) {
        super(graphics, maxZIndex);

        this.buffer = [];
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

    arc(x, y, r, sAngle = 0, eAngle = 360, width = 1, filled = false) {
        const { color, zIndex } = this;
        const radius = Math.floor(r);
        this.buffer.push(new Arc2D({
            x: Math.floor(x),
            y: Math.floor(y),
            startAngle: toRudian(sAngle),
            endAngle: toRudian(eAngle),
            width: Math.floor(width),
            radius,
            filled,
            color,
            zIndex,
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
    //    this.graphics.imageSmoothingEnabled = false;
        this.buffer
            .filter(operation => operation.zIndex < this.maxZIndex)
            .sort((firstOperation, secondOperation) => secondOperation.zIndex - firstOperation.zIndex)
            .forEach(operation => {
                operation.draw(this.graphics);

                // if(operation.hasShade && operation.width && operation.heigh) {
                //     this.graphics.fillStyle = "#000000";
                //     this.graphics.globalAlpha = 1 - (1 - (operation.zIndex / this.maxZIndex));
                //     this.graphics.fillRect(operation.x, operation.y, operation.width, operation.heigh);
                //     this.graphics.globalAlpha = 1;
                // }
            });

        this.buffer = [];
    }
}