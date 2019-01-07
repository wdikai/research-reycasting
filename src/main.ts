import {
  Game
} from './system/game';
import {
  GameState
} from './states/game';
import { ResourceManager } from './system/resource-manager';

const canvas = < HTMLCanvasElement > document.getElementById('canvas');
const fullscreenButton = document.getElementById('fullscreen');
fullscreenButton.addEventListener('click', () => launchFullScreen(canvas));

const game = new Game({
  canvas: canvas,
  width: 960,
  height: 720,
  maxZIndex: 60,
  scale: 2
});

game.resize();
game.manager.register('game', GameState);

ResourceManager.instance
  .addTExture('bat', './assets/bat.png')
  .addTExture('tiles', './assets/tiles.png')
  .textureLoaded.once(() => game.manager.setState('game'));

function launchFullScreen(element) {
  polifil(element);
  element.requestFullScreen();
  element.requestPointerLock();
}

function polifil(element) {
  element.requestFullScreen = element.requestFullScreen || element.mozRequestFullScreen || element.webkitRequestFullScreen;
  element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
}