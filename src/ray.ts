import {
    Vector2,
    Point,
    toRudian
} from './math';

import Map from './map';

export interface RayStep {
    length2: number;
    position ? : Vector2;
}

export interface RayHit {
    distance: number;
    position: Vector2;
    height ? : number
}

export class Ray {
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
                nextY.position;

            hit = {
                position: nextPosition,
                distance: position.distance(nextPosition),
                height: map.get(nextPosition.x, nextPosition.y)
            };
        }
        return result;
    }

    private static stepX(sin, cos, position: Point): RayStep {
        if (cos === 0) return {
            length2: Infinity
        };
        const dx = cos > 0 ?
            Math.floor(position.x + 1) - position.x :
            Math.ceil(position.x - 1) - position.x;
        const dy = dx * (sin / cos);
        const nextPosition = new Vector2(position.x + dx, position.y + dy);

        return {
            position: nextPosition,
            length2: dx * dx + dy * dy
        };
    }

    private static stepY(sin, cos, position: Point): RayStep {
        if (sin === 0) return {
            length2: Infinity
        };
        const dy = sin > 0 ?
            Math.floor(position.y + 1) - position.y :
            Math.ceil(position.y - 1) - position.y;
        const dx = dy * (cos / sin);
        const nextPosition = new Vector2(position.x + dx, position.y + dy);

        return {
            position: nextPosition,
            length2: dx * dx + dy * dy
        };
    }
}