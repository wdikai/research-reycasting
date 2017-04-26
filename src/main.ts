import Input from './input';
import Map from './map';
import Player from './player';

import {
    Vector2
} from './math';

import {
    Ray,
    RayHit
} from './ray';

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

const wallSize = 3;
const mapSize = 200;

canvas = < HTMLCanvasElement > document.getElementById('canvas');
canvas.width = canvas.height = wallSize * mapSize;
context = canvas.getContext('2d');

let renderCount = 0;
let fps = 0;
let time = Date.now();

// map = new Map(mapSize, wallSize, wallMap);
map = Map.generate(mapSize, wallSize, 0.05);


const position = new Vector2(mapSize / 2 + .5, mapSize / 2 + .5);

const playerAngle = 180;
const rayDistance = 40;
const rayCount = 60;
const focalLength = 1;
const speed = 0.1;
let now = Date.now();

const player = new Player(position, playerAngle, 0.01, 0.09, '#ff0000', wallSize);

const renderer = render.bind(null, context);

requestAnimationFrame(renderer);

function render(graphics: CanvasRenderingContext2D) {
    const deltaTime = Date.now() - now;
    now = Date.now();
    graphics.fillStyle = '#000000';
    graphics.fillRect(0, 0, canvas.width, canvas.height);

    if (Input.isClick(Input.SPACE_KEY)) DEBUG = !DEBUG;

    player.update(deltaTime, map);

    // map.render(graphics);
    for (let rayNumber = -rayCount / 2; rayNumber <= rayCount / 2; rayNumber++) {
        const angle = player.Angle + rayNumber * focalLength;
        const hits = Ray.cast(map, player.position, angle, rayDistance);
        renderHits(hits, graphics)
    }
    player.render(graphics);
    graphics.fillStyle = '#00ffff';
    graphics.fillText('FPS:' + fps, 25, 25);

    countFPS();

    requestAnimationFrame(renderer);
}

function renderHits(hits: RayHit[], graphics: CanvasRenderingContext2D) {
    let visible = true;

    for (let hit of hits) {
        let x, y, color;
        if (hit.height) break;

        x = Math.floor(hit.position.x);
        y = Math.floor(hit.position.y);
        color = Math.floor(255 - 255 * (hit.distance / rayDistance));
        graphics.fillStyle = `rgb(${color}, ${color}, ${color})`;
        graphics.fillRect(x * wallSize, y * wallSize, wallSize, wallSize);
    }
}

function countFPS() {
    renderCount++;

    if (Date.now() - time >= 1000) {
        time += 1000;
        fps = renderCount;
        renderCount = 0;
    }
}