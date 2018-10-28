import { BufferRenderer } from "../../graphics/renderer";

export interface State {
    init?(params?: any): void;
    changeSettings?(params?: any): void;
    update(deltaTime: number): void;
    draw(graphics: BufferRenderer): void;
    destroy?(): void;
}