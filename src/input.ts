const keys = {};

window.addEventListener('keyup', function (event) {
    var keyCode = event.keyCode;
    keys[keyCode] = false;
});

window.addEventListener('keydown', function (event) {
    var keyCode = event.keyCode;
    keys[keyCode] = true;
});

export default class Input {
    static SPACE_KEY = 32;
    static LEFT_ARROW_KEY = 37;
    static UP_ARROW_KEY = 38;
    static RIGHT_ARROW_KEY = 39;
    static DOWN_ARROW_KEY = 40;
    static KEY_1 = 49;
    static KEY_2 = 50;
    static KEY_3 = 51;
    static KEY_4 = 52;

    static isDown(keyCode) {
        return keys[keyCode];
    }

    static isClick(keyCode) {
        const result = keys[keyCode];
        keys[keyCode] = false;
        return result;
    }
};