import { KeyInputManager, Keys, MouseManager, TouchManager } from "../event/index";
import { Vector2D } from "../math/index";
import { BufferRenderer } from "../graphics/buffer-renderer";
import { RayCastCamera } from "../system/rey-cast-camera";
import { World } from "../system/world";
import { Color } from "../graphics/color";
import { State } from "../system/state/state";
import Map from "../math/map";
import { Player } from "./entity/player";
import { Renderer } from "../graphics/renderer";

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
    player: Player;


    floorColor = new Color(150,150,150);
    cailColor = new Color(200,200,200);

    init(): void {
        const map = new Map(22, wallSize, wallMap);
        const world = new World(map);

        const position = new Vector2D(7.2, 3);

        const angle = 180;
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
            world,
            scale: 2
        });

        this.world = world;
        this.camera = camera;

        this.player = new Player();
        this.player.position = position;
        this.player.angle = angle;
        this.player.rotateSpeed = 0.1;
        this.player.movementSpeed = 0.005;

        this.camera.resize();
    }

    draw(renderer: Renderer) {
        const halfHeight = this.camera.height / 2;
        renderer.setShadeMode(false);
        renderer.setZIndex(this.camera.rayDistance);
        renderer.setColor(this.cailColor);
        renderer.fillRect(0, 0, this.camera.width, halfHeight);
        renderer.setColor(this.floorColor);
        renderer.fillRect(0, halfHeight, this.camera.width, halfHeight);
        this.camera.draw(renderer);

        if(TouchManager.isTouched) {
            // TouchManager.touches.forEach(touch => {
            //     renderer.setZIndex(0);
            //     renderer.setColor(Color.Black);
            //     renderer.arc(touch.position.x, touch.position.y, 20, 0, 360, 5);
            //     renderer.arc(touch.lastTouch.x, touch.lastTouch.y, 30, 0, 360, 5);
            // });
        }
    }

    update(time: number) {
        if(!TouchManager.isTouched) {
            const movementX = MouseManager.movement.x;
            if (movementX) {
                this.player.rotate(time * this.player.rotateSpeed * movementX / 100);
            }
        }

        if (KeyInputManager.isDown(Keys.LEFT_ARROW_KEY)) this.player.rotate(-time * this.player.rotateSpeed);
        if (KeyInputManager.isDown(Keys.RIGHT_ARROW_KEY)) this.player.rotate(time * this.player.rotateSpeed);
        
        TouchManager.touches.forEach(touch => {
            if(touch.position.x > this.camera.width / 2) {
                this.player.rotate(-touch.move.x * this.player.rotateSpeed * time);
            } else {
                this.player.move(
                    touch.move
                        .normalize()
                        .rotate(-90 + this.player.angle)
                        .scale(this.player.movementSpeed * time), 
                    this.world.map
                );
            }
        })

        if (KeyInputManager.isDown(Keys.UP_ARROW_KEY)) this.player.move(Vector2D.fromAngle(this.player.angle, this.player.movementSpeed * time), this.world.map);
        if (KeyInputManager.isDown(Keys.DOWN_ARROW_KEY)) this.player.move(Vector2D.fromAngle(this.player.angle, -this.player.movementSpeed * time), this.world.map);
        
        if (KeyInputManager.isDown(Keys.KEY_W)) this.player.move(Vector2D.fromAngle(this.player.angle, this.player.movementSpeed * time), this.world.map);
        if (KeyInputManager.isDown(Keys.KEY_S)) this.player.move(Vector2D.fromAngle(this.player.angle, -this.player.movementSpeed * time), this.world.map);
        if (KeyInputManager.isDown(Keys.KEY_A)) this.player.move(Vector2D.fromAngle(this.player.angle - 90, this.player.movementSpeed * time / 2), this.world.map);
        if (KeyInputManager.isDown(Keys.KEY_D)) this.player.move(Vector2D.fromAngle(this.player.angle - 90, -this.player.movementSpeed * time / 2), this.world.map);
        
        this.camera.position = this.player.position;
        this.camera.angle = this.player.angle;
    }

    destroy() {
        this.world = null;
    }
}