import { Vector2D } from "../math/index";
import { BufferRenderer } from "../graphics/buffer-renderer";
import { toRudian } from "../math/utils";
import { Ray, RayHit } from "../math/ray";
import { World } from "./world";
import { ResourceManager } from "./resource-manager";
import { Renderer } from "../graphics/renderer";
import { Graphics } from "../graphics/graphics";

const TILE_SIZE = 16;

interface CameraOptions {
    position: Vector2D;
    angle: number;

    viewAngle: number;
    rayDistance: number;
    rayCount: number;
    halfRayCount: number;
    focalLength: number;
    
    width: number;
    height: number;
    scale: number;
    halfScreen: number;
    columnSize: number;

    world?: World;
}

export class RayCastCamera {
    position: Vector2D;
    angle: number;

    viewAngle: number;
    rayDistance: number;
    rayCount: number;
    halfRayCount: number;
    focalLength: number;
    
    width: number;
    height: number;
    halfScreen: number;
    columnSize: number;
    scale: number;

    world?: World;

    constructor(options: CameraOptions) {
        this.position = options.position;
        this.angle = options.angle;

        this.viewAngle = options.viewAngle;
        this.rayDistance = options.rayDistance;
        this.rayCount = options.rayCount;
        this.halfRayCount = options.halfRayCount;
        this.focalLength = options.focalLength;
        
        this.width = options.width;
        this.height = options.height;
        this.halfScreen = options.halfScreen;
        this.columnSize = options.columnSize;

        this.scale = options.scale;

        this.world = options.world;
        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    public move(vector: Vector2D) {
        this.position = this.position.sum(vector);
    }

    public rotate(rotate: number) {
        this.angle += rotate;
    }

    public resize() {
        const width = (window.innerWidth / this.scale);
        const height = (window.innerHeight / this.scale);
        const resolution = width / height;

        this.width = width;
        this.height = height;

        this.viewAngle = 90 / Math.PI * resolution;
        this.rayCount = width / this.columnSize;
        this.halfRayCount =  this.rayCount / 2
        this.focalLength =  this.viewAngle /  this.rayCount;
        this.halfScreen = width / 2;
    }

    public draw(renderer: Renderer): void {
        if(this.world) {
            this.renderColumns(renderer);
            this.drawObject(renderer);
        }
    }

    private renderColumns(renderer: Renderer) {
        for (let rayNumber = 0; rayNumber <= this.rayCount; rayNumber++) {
            const angle = this.angle + (rayNumber - this.halfRayCount) * this.focalLength;
            const hits = Ray.cast(this.world.map, this.position, angle, this.rayDistance);
            this.renderColumn(rayNumber, hits, renderer);
        }
    }

    private renderColumn(rayNumber: number, hits: RayHit[], graphics: Renderer) {
        let hit: RayHit, hitNumber = -1;
        while (++hitNumber < hits.length && hits[hitNumber].height <= 0);
        hit = hits[hitNumber];

        if (hit && hit.height) {
            const angle = (rayNumber - this.halfRayCount) * this.focalLength;
            const z = hit.distance * Math.cos(toRudian(angle));
            const bottom = this.height / 2 * (1 + 2 / z);
            const height = this.height / z * 2;
            const x = rayNumber * this.columnSize;
            const y = bottom - height;
            const textureX = Math.floor(TILE_SIZE * hit.offset);

            graphics.setShadeMode(true);
            graphics.setZIndex(hit.distance);
            graphics.drawImage(ResourceManager.instance.getTexture('tiles'), x, y, this.columnSize, height, textureX, 0, 1, TILE_SIZE);
            graphics.setShadeMode(false);
            this.renderFloor(x, y + height, this.height, z, hit, graphics);
        }
    }

    private renderFloor(x: number, bottom: number, height: number, z: number, hit: RayHit, graphics: Renderer): void {
        for(let y = Math.floor(bottom + 1); y < height; y++) {
            const currentDist = height / (2 * y - height); //you could make a small lookup table for this instead

            const weight = currentDist / z;

            const currentFloorX = weight * hit.position.x + (1.0 - weight) * this.position.x;
            const currentFloorY = weight * hit.position.y + (1.0 - weight) * this.position.y;

            const floorTexX = Math.floor(currentFloorX * 32) % 32;
            const floorTexY = Math.floor(currentFloorY * 32) % 32;

            const color = ResourceManager.instance
                .getTexture('tiles')
                .getColor(Math.floor(floorTexX), Math.floor(floorTexY));

            graphics.setColor(color);
            graphics.setZIndex(Math.floor(currentDist));
            graphics.drawPixel(x, y);
            
            // //floor
            // buffer[y][x] = (texture[floorTexture][texWidth * floorTexY + floorTexX] >> 1) & 8355711;
            // //ceiling (symmetrical!)
            // buffer[h - y][x] = texture[6][texWidth * floorTexY + floorTexX];
        }
    }

    private drawObject(bufferRenderer: Renderer) {
        // for(let enemy of this.world.objects) {
        //     const playerNormal = Vector2D.fromAngle(this.angle)
        //     const enamyNormal = enemy.position.sub(this.position)
        //     const distance = enamyNormal.length;
        //     const angle = Vector2D.angle(enamyNormal, playerNormal)
        //     const height = this.height / distance * 2;
        //     const bottom = this.height / 2 * (1 +  2 / distance);
        //     const x = this.halfScreen + angle * this.width / this.viewAngle - this.height / 2;
        //     const y = bottom - this.height;
    
        //     bufferRenderer.setZIndex(distance)
        //     // bufferRenderer.drawImage(image, x, y, height, height, TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
        // }
    }
}