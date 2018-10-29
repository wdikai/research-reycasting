import { Game } from './system/game';
import { GameState } from './states/game';

const canvas = < HTMLCanvasElement > document.getElementById('canvas');
const fullscreenButton = document.getElementById('fullscreen');
fullscreenButton.addEventListener('click', () => launchFullScreen(canvas));

const game = new Game({
    canvas: canvas,
    width: 960,
    height: 720,
    maxZIndex: 60,
    scale: 1
});

game.resize();
game.manager.register('game', GameState);
game.manager.setState('game');

function launchFullScreen(element) {
    if(element.requestFullScreen) {
      element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if(element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen();
    }
  }