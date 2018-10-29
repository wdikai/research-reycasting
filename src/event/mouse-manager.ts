import { Vector2D } from "../math/index";

interface MouseData {
    move: Vector2D;
    buttons: any;
    touchMove?: Vector2D;
    lastTouch?: Vector2D;
} 

const mouseData: MouseData = {
    move: Vector2D.zero,
    buttons: {}
};

export namespace MouseButton {
    export const LEFT_BUTTON = 0;
    export const CENTER_BUTTON = 1;
    export const RIGHT_BUTTON = 2;
}

window.addEventListener('mousedown', makeHandler(true), false);
window.addEventListener('mouseup', makeHandler(false), false);
window.addEventListener('mousemove', (event: MouseEvent) => mouseData.move = new Vector2D(event.movementX, event.movementY)); 
window.addEventListener('touchmove', (event: TouchEvent) => {
    const move = new Vector2D(event.changedTouches[0].screenX, event.changedTouches[0].screenY)
    if(mouseData.lastTouch) {
        mouseData.move = mouseData.lastTouch.sub(move);
    }

    mouseData.lastTouch = move;
}); 
window.addEventListener('touchend', (event: TouchEvent) => mouseData.lastTouch = null); 

function makeHandler(value: boolean) {
    return (event: MouseEvent) => {
        if (!mouseData.buttons[event.button]) {
            mouseData.buttons[event.button] = {
                down: false,
                clicked: false
            };
        }
    
        mouseData.buttons[event.button].down = value;
        mouseData.buttons[event.button].clicked = value;
    }
}

export class MouseManager {
    static isDown(button: number): boolean {
        return mouseData.buttons[button] ? mouseData.buttons[button].down : false;
    }

    static isClick(button: number): boolean {
        if (mouseData.buttons[button]) {
            const result = mouseData.buttons[button].click;
            mouseData.buttons[button].click = false
            return result;
        }

        return false;
    }

    static get movement (): Vector2D {
        const result = mouseData.move;
        mouseData.move = Vector2D.zero;
        return result;
    }
}