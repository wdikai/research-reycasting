import { KeyInputManager, Keys } from "../event/index";
import { Vector2D } from "../math/index";
import { BufferRenderer } from "../graphics/renderer";
import { RayCastCamera } from "../system/rey-cast-camera";
import { World } from "../system/world";
import { Color } from "../graphics/color";
import { State } from "../system/state/state";
import Map from "../math/map";

const wallMap = [
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

const wallSize = 24;

const width = 960;
const height = 720;
const columnSize = 1;
const viewDistance = 30;

export class GameState implements State {
    world: World;
    camera: RayCastCamera;

    rotateSpeed = 0.05;
    movementSpeed = 0.01;

    floorColor = new Color(150,150,150);
    cailColor = new Color(200,200,200);

    init(): void {
        const map = new Map(22, wallSize, wallMap);
        const world = new World(map);

        const position = new Vector2D(7.2, 3);

        const angle = 90;
        const rayDistance = viewDistance - 1;
        const viewAngle = 60;
        const rayCount = width / columnSize;
        const halfRayCount = rayCount / 2;
        const focalLength = viewAngle / rayCount;
        const halfScreen = width / 2;

        const camera = new RayCastCamera({
            position,
            angle,
            rayDistance,
            viewAngle,
            rayCount,
            halfRayCount,
            focalLength,
            halfScreen,
            width,
            height,
            columnSize,
            world
        });

        this.world = world;
        this.camera = camera;
        this.camera.resize();
    }

    draw(renderer: BufferRenderer) {
        const halfHeight = this.camera.height / 2;
        renderer.setShadeMode(false);
        renderer.setZIndex(this.camera.rayDistance);
        renderer.setColor(this.cailColor);
        renderer.fillRect(0, 0, this.camera.width, halfHeight);
        renderer.setColor(this.floorColor);
        renderer.fillRect(0, halfHeight, this.camera.width, halfHeight);
        this.camera.draw(renderer);
    }

    update(time: number) {
        if (KeyInputManager.isDown(Keys.LEFT_ARROW_KEY)) this.camera.rotate(-time * this.rotateSpeed);
        if (KeyInputManager.isDown(Keys.RIGHT_ARROW_KEY)) this.camera.rotate(time * this.rotateSpeed);

        if (KeyInputManager.isDown(Keys.UP_ARROW_KEY)) this.camera.move(Vector2D.fromAngle(this.camera.angle, this.movementSpeed * time));
        if (KeyInputManager.isDown(Keys.DOWN_ARROW_KEY)) this.camera.move(Vector2D.fromAngle(this.camera.angle, -this.movementSpeed * time));

        
        if (KeyInputManager.isDown(Keys.KEY_W)) this.camera.move(Vector2D.fromAngle(this.camera.angle, this.movementSpeed * time));
        if (KeyInputManager.isDown(Keys.KEY_S)) this.camera.move(Vector2D.fromAngle(this.camera.angle, -this.movementSpeed * time));
        if (KeyInputManager.isDown(Keys.KEY_A)) this.camera.move(Vector2D.fromAngle(this.camera.angle - 90, this.movementSpeed * time / 2));
        if (KeyInputManager.isDown(Keys.KEY_D)) this.camera.move(Vector2D.fromAngle(this.camera.angle - 90, -this.movementSpeed * time / 2));
    }

    destroy() {
        this.world = null;
    }
}