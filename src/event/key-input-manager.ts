const keys: any = {};

window.addEventListener('keyup', makeHandler(false));
window.addEventListener('keydown', makeHandler(true));

function makeHandler(value: boolean) {
    return (event: KeyboardEvent) => {
        var keyCode = event.keyCode;
        if (!keys[keyCode]) {
            keys[keyCode] = {
                down: false,
                click: false
            };
        }

        keys[keyCode].down = value;
        keys[keyCode].click = value;
    }
}

export class KeyInputManager {
    static isDown(keyCode): boolean {
        return keys[keyCode] ? keys[keyCode].down : false;
    }

    static isClick(keyCode): boolean {
        if (keys[keyCode]) {
            const result = keys[keyCode].click;
            keys[keyCode].click = false;
            return result;
        }

        return false;
    }
};