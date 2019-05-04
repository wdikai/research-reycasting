import { Renderer } from "../../graphics/renderer";

export interface State {
    init?(params?: any): void;
    changeSettings?(params?: any): void;
    update(deltaTime: number): void;
    draw(graphics: Renderer): void;
    destroy?(): void;
}