import { Color } from "./color";
import { toRudian } from "../math/utils";
import { Graphics } from "./graphics";
import { Texture } from "./texture";

declare type CanvasImageSource = any;

export class Renderer {
    protected graphics: Graphics;

    protected color: Color;
    protected hasShade: boolean;
    protected zIndex: number;
    protected maxZIndex: number

    constructor(graphics: Graphics, maxZIndex: number = Infinity) {
        this.graphics = graphics;
        this.maxZIndex = maxZIndex;
    }

    get canDraw() {
        return this.zIndex >= 0 && this.zIndex <= this.maxZIndex;
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
        const { color, zIndex } = this;

        if(this.canDraw) this.graphics.drawRect(x, y, width, heigh, color, zIndex);
    }

    arc(x: number, y: number, radius: number, sAngle: number = 0, eAngle: number = 360): void {
        const { color } = this;
        

        if(this.canDraw) this.graphics.drawArc(x, y, radius, toRudian(sAngle), toRudian(eAngle), color);
    }

    drawImage(image: CanvasImageSource, x: number, y: number, width?: number, heigh?: number, clipX?: number, clipY?: number, clipWidth?: number, clipHeigh?: number): void {
        const { zIndex } = this;
        
        if(this.canDraw) this.graphics.drawTexture(
            image,
            Math.floor(x),
            Math.floor(y),
            width && Math.floor(width),
            heigh && Math.floor(heigh),
            clipX && Math.floor(clipX),
            clipY && Math.floor(clipY),
            clipWidth && Math.floor(clipWidth),
            clipHeigh && Math.floor(clipHeigh),
            zIndex
        );
    }

    render() {}
}