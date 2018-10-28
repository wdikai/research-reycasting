import { Point, ZERO } from "./point";
import { toDegree, toRudian } from "./utils";

export class Vector2D implements Point {
    static of (point: Point) {
        return new Vector2D(point.x, point.y)
    }

    static dot(first, second) {
        return first.x * second.x + first.y * second.y;
    }

    static cross(first, second) {
        return second.x * first.y - second.y * first.x;
    }

    static angle(first: Vector2D, second: Vector2D) {
        const fn = first.normalize();
        const sn = second.normalize();
        const scalar = Vector2D.dot(fn, sn);
        let angle = Math.acos(scalar);

        if (Vector2D.cross(fn, sn) < 0) {
            angle = -angle;
        }

        return toDegree(angle);
    }

    static distance(from: Point, to: Point = ZERO) {
        const dx = from.x - to.x;
        const dy = from.y - to.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    static fromAngle(angle: number, distance: number = 1) {
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

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get length() {
        return this._length;
    }

    sum(vector: Vector2D) {
        return new Vector2D(
            this.x + vector.x,
            this.y + vector.y
        );
    }

    sub(vector: Vector2D) {
        return vector
            .scale(-1)
            .sum(this);
    }

    scale(number: number) {
        return new Vector2D(
            this.x * number,
            this.y * number
        );
    }

    divide(number: number) {
        return new Vector2D(
            this.x / number,
            this.y / number
        );
    }

    normalize() {
        return this.divide(this.length);
    }

    scalar(to: Point) {
        return Vector2D.dot(this, to);
    }

    distance(to: Point) {
        return Vector2D.distance(this, to);
    }

    toString() {
        return `[${this.x}, ${this.y}]`
    }
}