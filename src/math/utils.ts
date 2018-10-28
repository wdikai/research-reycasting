export function toRudian(angle: number): number {
    return angle * Math.PI / 180;
}

export function toDegree(angle: number): number {
    return angle * 180 / Math.PI;
}

export function toDecimal(input: number): number {
    return input - Math.floor(input);
}