import { Vector2D } from "../math/index";
import { Dictionary } from "../utils/dictionary";

interface TouchData {
    identifier: number;
    move ? : Vector2D;
    lastTouch ? : Vector2D;
    position ? : Vector2D;
}

const touchDatas: Dictionary < TouchData > = {};
window.addEventListener('touchstart', (event: TouchEvent) => {
    const changedTouches = event.changedTouches;
    for (let touchNumber = 0; touchNumber < event.changedTouches.length; touchNumber++) {
        const touchEvent = changedTouches[touchNumber];
        const position = new Vector2D(touchEvent.screenX, touchEvent.screenY);
        touchDatas[touchEvent.identifier] = {
            identifier: touchEvent.identifier,
            move: Vector2D.zero,
            lastTouch: position,
            position: position
        };
    }
});
window.addEventListener('touchmove', (event: TouchEvent) => {
    const changedTouches = event.changedTouches;
    for (let touchNumber = 0; touchNumber < event.changedTouches.length; touchNumber++) {
        const touchEvent = changedTouches[touchNumber];
        const touchData = touchDatas[touchEvent.identifier] || {
            identifier: touchEvent.identifier
        };
        const move = new Vector2D(touchEvent.screenX, touchEvent.screenY)
        if (touchData.lastTouch) {
            touchData.move = touchData.lastTouch.sub(move);
        }

        touchData.lastTouch = move;
    }
});
window.addEventListener('touchend', (event: TouchEvent) => {
    const changedTouches = event.changedTouches;
    for (let touchNumber = 0; touchNumber < event.changedTouches.length; touchNumber++) {
        const touchEvent = changedTouches[touchNumber];
        const touchData = touchDatas[touchEvent.identifier] || {
            identifier: touchEvent.identifier
        };
        const move = new Vector2D(touchEvent.screenX, touchEvent.screenY)
        touchData.move = touchData.lastTouch.sub(move);
        touchData.lastTouch = null;
    }
});

export class TouchManager {
    static get isTouched() {
        return 'ontouchstart' in window;
    } 

    static get touches(): TouchData[] {
        return Object.keys(touchDatas).map(key => touchDatas[key]);
    }
}