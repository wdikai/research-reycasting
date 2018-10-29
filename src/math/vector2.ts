import { Point, ZERO } from "./point";
import { toDegree, toRudian } from "./utils";

export class Vector2D implements Point {
    static zero: Vector2D = new Vector2D(ZERO.x, ZERO.y);

    static of (point: Point): Vector2D {
        return new Vector2D(point.x, point.y)
    }

    static dot(first, second): number {
        return first.x * second.x + first.y * second.y;
    }

    static cross(first, second): number {
        return second.x * first.y - second.y * first.x;
    }

    static angle(first: Vector2D, second: Vector2D): number {
        const fn = first.normalize();
        const sn = second.normalize();
        const scalar = Vector2D.dot(fn, sn);
        let angle = Math.acos(scalar);

        if (Vector2D.cross(fn, sn) < 0) {
            angle = -angle;
        }

        return toDegree(angle);
    }

    static distance(from: Point, to: Point = ZERO): number {
        const dx = from.x - to.x;
        const dy = from.y - to.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    static fromAngle(angle: number, distance: number = 1): Vector2D {
        return new Vector2D(
            Math.cos(toRudian(angle)) * distance,
            Math.sin(toRudian(angle)) * distance
        );
    }

    private _x: number;
    private _y: number;
    private _length: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;

        this._length = Vector2D.distance(this);
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get length(): number {
        return this._length;
    }

    sum(vector: Vector2D): Vector2D {
        return new Vector2D(
            this.x + vector.x,
            this.y + vector.y
        );
    }

    sub(vector: Vector2D): Vector2D {
        return vector
            .scale(-1)
            .sum(this);
    }

    scale(number: number): Vector2D {
        return new Vector2D(
            this.x * number,
            this.y * number
        );
    }

    divide(number: number): Vector2D {
        if(!number) return this;

        return new Vector2D(
            this.x / number,
            this.y / number
        );
    }

    normalize(): Vector2D {
        return this.divide(this.length);
    }

    rotate(angle) {
        const cos = Math.cos(toRudian(angle));
        const sin = Math.sin(toRudian(angle));

        return new Vector2D((cos * this.x - sin * this.y), (sin * this.x + cos * this.y));
    }

    scalar(to: Point): number {
        return Vector2D.dot(this, to);
    }

    distance(to: Point): number {
        return Vector2D.distance(this, to);
    }

    toString() {
        return `[${this.x}, ${this.y}]`
    }
}