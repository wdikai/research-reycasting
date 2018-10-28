import Map from "../math/map";
import { GameObject2D } from "./game-object";

export class World {
    map: Map;
    objects: GameObject2D[];

    constructor (map: Map) {
        this.map = map;
        this.objects = [];
    }

    addObjects(objects: GameObject2D): void {
        this.objects.push(objects);
    }
}