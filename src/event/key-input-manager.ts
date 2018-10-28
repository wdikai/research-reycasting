import { Dictionary } from "../utils/dictionary";

interface KeyEvent {
    down: boolean; 
    click: boolean; 
};
const keys: Dictionary<KeyEvent> = {};

window.addEventListener('keyup', function (event) {
    var keyCode = event.keyCode;
    if(!keys[keyCode]) {
        keys[keyCode] = {down: false, click: false};
    }

    keys[keyCode].down = false;
    keys[keyCode].click = false;
});

window.addEventListener('keydown', function (event) {
    var keyCode = event.keyCode;
    if(!keys[keyCode]) {
        keys[keyCode] = {down: false, click: false};
    }

    keys[keyCode].down = true;
    keys[keyCode].click = true;
});

export class KeyInputManager {
    static isDown(keyCode): boolean {
        return keys[keyCode] ? keys[keyCode].down: false;
    }

    static isClick(keyCode): boolean {
        if(keys[keyCode]) {
            const result = keys[keyCode].click;
            keys[keyCode].click = true
            return result;
        }

        return false;
    }
};