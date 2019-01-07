import { StateManager } from "./state/state-manager";
import { BufferRenderer } from "../graphics/renderer";
import { Graphics } from "../graphics/graphics";

export interface GameOptions {
    canvas: HTMLCanvasElement;
    maxZIndex?: number;

    width: number;
    height: number;
    scale: number;
};

export class Game {
    manager: StateManager;

    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    graphics: Graphics;
    renderer: BufferRenderer;

    lastTick: number;
    width: number;
    height: number;
    scale: number;

    latest: number;
    frames: number;
    fps: number;

    constructor(options: GameOptions) {
        const context = options.canvas.getContext('2d');

        this.lastTick = Date.now();
        this.manager = new StateManager();
        this.canvas = options.canvas;
        this.context = context;
        this.graphics = new Graphics(options.width, options.height)
        this.renderer = new BufferRenderer(this.graphics, options.maxZIndex);
        this.width = options.width;
        this.height = options.height;
        this.scale = options.scale;
        window.addEventListener('resize', () => this.resize());
        requestAnimationFrame(() => this.tick());
        this.latest = Date.now();
        this.frames = 0;
        this.fps = 0;
    }

    tick(): void {
        const now = Date.now();
        const deltaTime = now - this.lastTick;
        if(now - this.latest >= 1000) {
            this.fps = this.frames;
            this.frames = 0;
            this.latest += 1000;
        }
        this.lastTick += deltaTime;

        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.width,  this.height);
        this.manager.update(deltaTime);
        this.manager.draw(this.renderer); 
        this.renderer.render();
        this.context.putImageData(this.graphics.buffer, 0, 0);
        this.graphics.resize(this.width,  this.height);

        this.context.fillStyle = '#000';
        this.context.fillRect(this.width - 60, 0, 60, 15);
        this.context.fillStyle = '#fff';
        this.context.fillText('fps: ' + this.fps, this.width - 50, 10);
        
        this.frames++;
        requestAnimationFrame(() => this.tick());
    }

    resize() {
        this.canvas.width = this.width = (window.innerWidth / this.scale);
        this.canvas.height = this.height = (window.innerHeight / this.scale);
        this.graphics.resize(this.width, this.height);
    }
}