class Game {

  constructor (app) {
    this.reset();
  }

  reset () {
    this.uuid = undefined;
    this.app = undefined;
    this.gameInstanceId = undefined;
  }

  start (gameView, gameInstanceId, uuid, pubnub) {
    this.pubnub = pubnub;
    this.uuid = uuid;
    this.gameInstanceId = gameInstanceId;
    this.app = new PIXI.Application({ width: 640, height: 360 });

    pubnub.setUUID(uuid);

    gameView.append(this.app.view);

    this.render();
  }

  stop () {
    this.app.ticker.stop();
    this.app.destroy(true);
    this.reset();
  }

  render () {
    if (!this.app) {
      return;
    }

    let sprite = PIXI.Sprite.from('/game/profile/box.png');

    this.app.stage.addChild(sprite);

    // Add a variable to count up the seconds our demo has been running
    let elapsed = 0.0;
    // Tell our application's ticker to run a new callback every frame, passing
    // in the amount of time that has passed since the last tick
    this.app.ticker.add((delta) => {
      // Add the time to our total elapsed time
      elapsed += delta;
      // Update the sprite's X position based on the cosine of our elapsed time.  We divide
      // by 50 to slow the animation down a bit...
      sprite.x = 300.0 + Math.cos(elapsed/50.0) * 300.0;
    });
  }
}

window.Game = Game;