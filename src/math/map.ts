export default class Map {
    private map: number[];
    private size: number;
    private wallSize: number;

    constructor(size: number, wallSize: number, map ? : number[]) {
        this.size = size;
        this.wallSize = wallSize;
        this.map = map || [];
    }

    get WallSize() {
        return this.wallSize;
    }

    get(x: number, y: number): number {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1;
        return this.map[y * this.size + x];
    }

    static generate(size: number, wallSize: number = 1, shans:number): Map {
        const map = [];
        for (var i = 0; i < size * size; i++) {
            map.push(Math.random() < shans);
        }

        return new Map(size, wallSize, map);
    }
}