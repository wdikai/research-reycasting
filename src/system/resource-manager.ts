import { Texture } from "../graphics/texture";
import { EventEmitter } from "../utils/event-emitter";

export class ResourceManager {
    private static _instance: ResourceManager;
    public static get instance (): ResourceManager {
        return this._instance || (this._instance = new ResourceManager());
    }

    public readonly textureLoaded: EventEmitter<void>;
    private textures: Map<string, Texture>;
    private numberLoadings: number = 0;

    constructor() {
        this.textureLoaded = new EventEmitter<void>();
        this.textures = new Map();
    }

    addTExture(name: string, path: string): ResourceManager {
        this.numberLoadings++;
        Texture
            .load(path)
            .then(texture => {
                this.textures.set(name, texture);
                this.numberLoadings--;
            })
            .then(() => {
                if(!this.numberLoadings) {
                    this.textureLoaded.emit(undefined)
                }
            })

        return this;
    }

    getTexture (name): Texture {
        return this.textures.get(name) || null;
    }

    removeTexture(name: string): ResourceManager {
        this.textures.delete(name);
        return this;
    }
}