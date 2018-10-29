import { Game } from './system/game';
import { GameState } from './states/game';
import { MouseManager } from './event/index';

const canvas = document.getElementById('canvas');

const game = new Game({
    canvas: < HTMLCanvasElement > canvas,
    width: 960,
    height: 720,
    scale: 2
});

game.resize();
game.manager.register('game', GameState);
game.manager.setState('game');

