import {
    Input
} from './input';

let canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    map: Map,
    wallMap = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1,
        1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ];

let DEBUG = false;

const wallSize = 32;
const mapSize = 22;

canvas = < HTMLCanvasElement > document.getElementById('canvas');
canvas.width = canvas.height = wallSize * mapSize;
context = canvas.getContext('2d');

class Vector2 {
    private x: number;
    private y: number;

    constructor(x: number = 0, y: number) {
        this.x = x;
        this.y = y;
    }

    get X() {
        return this.x;
    }

    get Y() {
        return this.y;
    }

    sum(vector: Vector2) {
        return new Vector2(
            this.X + vector.X,
            this.Y + vector.Y
        );
    }

    sub(vector: Vector2) {
        return new Vector2(
            this.X - vector.X,
            this.Y - vector.Y
        );
    }

    distance(point: Vector2) {
        return Math.sqrt((this.X - point.X) * (this.X - point.X) + (this.Y - point.Y) * (this.Y - point.Y));
    }

    static fromAngle(angle: number, distance: number = 1) {
        return new Vector2(
            Math.cos(toRudian(angle)) * distance,
            Math.sin(toRudian(angle)) * distance
        );
    }
}

class Map {
    private map: number[];
    private size: number;
    private _wallSize: number;

    constructor(size: number, map ? : number[]) {
        this.size = size;
        this._wallSize = wallSize;
        this.map = map || [];
    }

    get wallSize() {
        return this._wallSize;
    }

    get(x: number, y: number): number {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1;
        return this.map[y * this.size + x];
    }

    render(graphics: CanvasRenderingContext2D) {
        const wallSize = this._wallSize;

        for (let i = 0; i < this.size * this.size; i++) {
            const xOffset = Math.floor(i / this.size);
            const yOffset = i % this.size;

            if (DEBUG) graphics.fillStyle = this.get(xOffset, yOffset) ? '#909090' : '#c0c0c0';
            else graphics.fillStyle = '#000000';
            graphics.fillRect(xOffset * wallSize, yOffset * wallSize, wallSize, wallSize);

            if (DEBUG) {
                graphics.fillStyle = '#000000';
                graphics.strokeRect(xOffset * wallSize, yOffset * wallSize, wallSize, wallSize);
                graphics.fillText(xOffset + ' ' + yOffset, xOffset * wallSize + 5, yOffset * wallSize + wallSize / 2);
            }
        }
    }

    static generate(size: number): Map {
        const map = [];
        for (var i = 0; i < size * size; i++) {
            map.push(Math.round(Math.random()));
        }

        return new Map(size, map)
    }
}

interface RayStep {
    length2: number;
    position ? : Vector2;
}
interface RayHit {
    distance: number;
    position: Vector2;
    height ? : number
}

class Ray {
    static cast(map: Map, position: Vector2, angle: number, range: number): RayHit[] {
        let hit: RayHit = {
                position,
                distance: 0
            },
            nextX: RayStep,
            nextY: RayStep,
            nextPosition: Vector2,
            result: RayHit[] = [];

        const sin: number = Math.sin(toRudian(angle));
        const cos: number = Math.cos(toRudian(angle));

        while (hit.distance < range) {
            result.push(hit);
            nextX = Ray.stepX(sin, cos, hit.position);
            nextY = Ray.stepY(sin, cos, hit.position);

            nextPosition = nextX.length2 < nextY.length2 ?
                nextX.position :
                nextY.position
            const [shiftX, shiftY] = nextX.length2 < nextY.length2 ? [1, 0] : [0, 1];

            var dx = cos < 0 ? shiftX : 0;
            var dy = sin < 0 ? shiftY : 0;

            hit = {
                position: nextPosition,
                distance: position.distance(nextPosition),
                height: map.get(nextPosition.X - dx, nextPosition.Y - dy)
            };
        }
        return result;
    }

    private static stepX(sin, cos, position: Vector2): RayStep {
        if (cos === 0) return {
            length2: Infinity
        };
        const dx = cos > 0 ?
            Math.floor(position.X + 1) - position.X :
            Math.ceil(position.X - 1) - position.X;
        const dy = dx * (sin / cos);
        const nextPosition = new Vector2(position.X + dx, position.Y + dy);

        return {
            position: nextPosition,
            length2: dx * dx + dy * dy
        };
    }


    private static stepY(sin, cos, position: Vector2): RayStep {
        if (sin === 0) return {
            length2: Infinity
        };
        const dy = sin > 0 ?
            Math.floor(position.Y + 1) - position.Y :
            Math.ceil(position.Y - 1) - position.Y;
        const dx = dy * (cos / sin);
        const nextPosition = new Vector2(position.X + dx, position.Y + dy);

        return {
            position: nextPosition,
            length2: dx * dx + dy * dy
        };
    }
}

class Player {
    private position: Vector2;
    private angle: number;
    private color: string;
    private speed: number;
    private rotateSpeed: number;
    private size: number;

    constructor(position: Vector2, angle: number, color: string, speed: number, rotateSpeed: number, size: number = 1) {
        this.position = position;
        this.angle = angle;
        this.color = color;
        this.speed = speed;
        this.rotateSpeed = rotateSpeed;
        this.size = size;
    }

    get Position() {
        return this.position;
    }

    get Angle() {
        return this.angle;
    }

    update(time) {
        let nextPosition;
        const speedVector = Vector2.fromAngle(this.angle, this.speed * time);

        if (Input.isDown(Input.LEFT_ARROW_KEY)) this.angle -= time * this.rotateSpeed;
        if (Input.isDown(Input.RIGHT_ARROW_KEY)) this.angle += time * this.rotateSpeed;
        if (Input.isDown(Input.UP_ARROW_KEY)) {
            nextPosition = this.position.sum(speedVector);
        }
        if (Input.isDown(Input.DOWN_ARROW_KEY)) {
            nextPosition = this.position.sub(speedVector);
        }

        const hasMove = nextPosition && !map.get(nextPosition.X, nextPosition.Y);

        if (hasMove) {
            this.position = nextPosition;
        }
    }

    public render(graphics) {
        const head = this.position.sum(Vector2.fromAngle(this.angle, this.size / 2))
        const center = this.position;
        const left = this.position.sub(Vector2.fromAngle(this.angle - 65, this.size / 3));
        const right = this.position.sub(Vector2.fromAngle(this.angle + 65, this.size / 3));

        graphics.beginPath();
        graphics.moveTo(center.X * wallSize, center.Y * wallSize);
        graphics.lineTo(left.X * wallSize, left.Y * wallSize);
        graphics.lineTo(head.X * wallSize, head.Y * wallSize);
        graphics.lineTo(right.X * wallSize, right.Y * wallSize);
        graphics.lineTo(center.X * wallSize, center.Y * wallSize);
        context.closePath();
        graphics.lineJoin = 'miter';
        graphics.fillStyle = this.color;
        graphics.fill();

    }
}

function toRudian(angle: number): number {
    return angle * Math.PI / 180;;
}

function renderHits(hits: RayHit[], graphics: CanvasRenderingContext2D) {
    let visible = true;

    for (let hit of hits) {
        if (hit.height) visible = false;

        if (!hit.height && visible && !DEBUG) {
            const x = Math.floor(hit.position.X);
            const y = Math.floor(hit.position.Y);

            graphics.fillStyle = '#ffffff';
            graphics.fillRect(x * wallSize, y * wallSize, wallSize, wallSize);
        }

        if (DEBUG) {
            graphics.fillStyle = '#ff0000';
            graphics.fillRect(hit.position.X * wallSize, hit.position.Y * wallSize, 4, 4);
        }
    }
}

let renderCount = 0;
let fps = 0;
let time = Date.now();

function countFPS() {
    renderCount++;

    if (Date.now() - time >= 1000) {
        time += 1000;
        fps = renderCount;
        renderCount = 0;
    }
}

function render(graphics: CanvasRenderingContext2D) {
    const deltaTime = Date.now() - now;
    now = Date.now();

    if (Input.isClick(Input.SPACE_KEY)) DEBUG = !DEBUG;

    player.update(deltaTime);

    map.render(graphics);
    for (let rayNumber = -rayCount / 2; rayNumber <= rayCount / 2; rayNumber++) {
        const angle = player.Angle + rayNumber * focalLength;
        const hits = Ray.cast(map, player.Position, angle, 10);
        renderHits(hits, graphics)
    }
    player.render(graphics);
    graphics.fillStyle = '#00ffff';
    graphics.fillText('FPS:' + fps, 25, 25);

    countFPS();

    requestAnimationFrame(renderer);
}

map = new Map(mapSize, wallMap);

const renderer = render.bind(null, context);

let position = new Vector2(mapSize / 2 + .5, mapSize / 2 + .5);

let playerAngle = 180;
let rayCount = 480;
let focalLength = .125;
let now = Date.now();
let speed = 0.1;

let player = new Player(position, playerAngle, '#ff0000', 0.01, 0.09);

requestAnimationFrame(renderer);