import {
    Vector2
} from './math';
import Map from './map';
import Input from './input';

export default class Player {
    constructor(
        private _position: Vector2,
        private _angle: number,
        private _speed: number,
        private _rotateSpeed: number,
        private _style: string,
        private _size: number = 5) {}

    get position() {
        return this._position;
    }

    get Angle() {
        return this._angle;
    }

    update(time, map: Map) {
        if (Input.isDown(Input.LEFT_ARROW_KEY)) this.rotate(-time);
        if (Input.isDown(Input.RIGHT_ARROW_KEY)) this.rotate(time);

        if (Input.isDown(Input.UP_ARROW_KEY)) this.move(Vector2.fromAngle(this._angle, this._speed * time), map);
        if (Input.isDown(Input.DOWN_ARROW_KEY)) this.move(Vector2.fromAngle(this._angle, -this._speed * time), map);
    }

    move(speed: Vector2, map: Map) {
        const nextPosition = this.position.sum(speed);

        if (!map.get(nextPosition.x, nextPosition.y)) {
            this._position = nextPosition;
        }
    }

    rotate(time: number) {
        this._angle += time * this._rotateSpeed;
    }

    public render(graphics) {
        const center = this.position;
        const head = this.position.sum(Vector2.fromAngle(this._angle, 1))
        const left = this.position.sum(Vector2.fromAngle(this._angle - 65, -0.5));
        const right = this.position.sum(Vector2.fromAngle(this._angle + 65, -0.5));

        graphics.beginPath();
        graphics.moveTo(center.x * this._size, center.y * this._size);
        graphics.lineTo(left.x * this._size, left.y * this._size);
        graphics.lineTo(head.x * this._size, head.y * this._size);
        graphics.lineTo(right.x * this._size, right.y * this._size);
        graphics.lineTo(center.x * this._size, center.y * this._size);
        graphics.closePath();
        graphics.lineJoin = 'miter';
        graphics.fillStyle = this._style;
        graphics.fill();

    }
}