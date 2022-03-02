class Game {

  constructor (app) {
    this.app = undefined;
  }

  start (app) {
    this.app = app;
    this.render();
  }

  render () {
    let sprite = PIXI.Sprite.from('/game/box.png');

    this.app.stage.addChild(sprite);
  }
}

window.game = new Game();