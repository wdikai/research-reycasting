import { StateManager } from "./state/state-manager";
import { BufferRenderer } from "../graphics/renderer";

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
    renderer: BufferRenderer;

    lastTick: number;
    width: number;
    height: number;
    scale: number;

    constructor(options: GameOptions) {
        const context = options.canvas.getContext('2d');

        this.lastTick = Date.now();
        this.manager = new StateManager();
        this.canvas = options.canvas;
        this.context = context;
        this.renderer = new BufferRenderer(context, options.maxZIndex);
        this.width = options.width;
        this.height = options.height;
        this.scale = options.scale;
        window.addEventListener('resize', () => this.resize());
        requestAnimationFrame(() => this.tick());
    }

    tick(): void {
        const deltaTime = Date.now() - this.lastTick;
        this.lastTick += deltaTime;

        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.width,  this.height);
        this.manager.update(deltaTime);
        this.manager.draw(this.renderer);
        this.renderer.render();
        requestAnimationFrame(() => this.tick());
    }

    resize() {
        this.canvas.width = this.width = (window.innerWidth / this.scale);
        this.canvas.height = this.height = (window.innerHeight / this.scale);
    }
}