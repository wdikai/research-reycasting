import { Game } from './system/game';
import { GameState } from './states/game';


const game = new Game({
    canvas: < HTMLCanvasElement > document.getElementById('canvas'),
    width: 960,
    height: 720,
    scale: 2
});

game.resize();
game.manager.register('game', GameState);
game.manager.setState('game');

