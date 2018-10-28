export class Color {
    static readonly Black = new Color(0, 0, 0);
    static readonly Red = new Color(255, 0, 0);
    static readonly Green = new Color(0, 255, 0);
    static readonly Blue = new Color(0, 0, 255);
    static readonly White = new Color(255, 255, 255);

    constructor(public readonly red: number, public readonly green: number, public readonly blue: number) {}
    
    toString() {
        return `rgb(${this.red},${this.green},${this.blue})`;
    }
}