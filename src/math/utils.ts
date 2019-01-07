export function toRudian(angle: number): number {
    return angle * Math.PI / 180;
}

export function toDegree(angle: number): number {
    return angle * 180 / Math.PI;
}

export function toDecimal(input: number): number {
    return input - Math.floor(input);
}

export function lerp(v0: number, v1: number, t: number) {
    t = clamp(0, 1, t);
    return (1 - t) * v0 + t * v1;
}

export function clamp(min: number, max: number, value: number) {
    return Math.min(Math.max(value, min), max);
}