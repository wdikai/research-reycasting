import { GameObject2D } from "../../system/game-object";
import { Vector2D } from "../../math/index";
import Map from "../../math/map";

export class Player extends GameObject2D {
    movementSpeed: number;
    rotateSpeed: number;

    move(diff: Vector2D, map: Map) {
        this.movePart(new Vector2D(0, diff.y), map);
        this.movePart(new Vector2D(diff.x, 0), map);
    }

    movePart(diff: Vector2D, map: Map) {
        const nextPosition = this.position.sum(diff);

        if (!map.get(nextPosition.x, nextPosition.y)) {
            this.position = nextPosition;
        }
    }

    rotate(rotate: number) {
        this.angle += rotate;
    }
}