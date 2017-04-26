export interface Point {
    x: number;
    y: number;
}

export const ZERO: Point = {
    x: 0,
    y: 0
};

export class Vector2 implements Point {
    private _x: number;
    private _y: number;
    private _length: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;

        this._length = Vector2.distance(this);
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

    sum(vector: Vector2) {
        return new Vector2(
            this.x + vector.x,
            this.y + vector.y
        );
    }

    sub(vector: Vector2) {
        return vector
            .scale(-1)
            .sum(this);
    }

    scale(number: number) {
        return new Vector2(
            this.x * number,
            this.x * number
        );
    }

    scalar(to: Point) {
        return Vector2.scalar(this, to);
    }

    distance(to: Point) {
        return Vector2.distance(this, to);
    }

    static scalar(first, second) {
        return first.x * second.x + first.y * second.y;
    }

    static angle(first, second) {
        const scalar = Vector2.scalar(first, second);
        const firstLength = first.length;
        const secondLength = second.length;
        const angle = Math.acos(scalar / (firstLength * secondLength));

        return toDegree(angle);
    }

    static distance(from: Point, to: Point = ZERO) {
        const dx = from.x - to.x;
        const dy = from.y - to.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    static fromAngle(angle: number, distance: number = 1) {
        return new Vector2(
            Math.cos(toRudian(angle)) * distance,
            Math.sin(toRudian(angle)) * distance
        );
    }
}

export function toRudian(angle: number): number {
    return angle * Math.PI / 180;
}

export function toDegree(angle: number): number {
    return angle * 180 / Math.PI;
}