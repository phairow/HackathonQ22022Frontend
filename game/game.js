class Game {

  constructor (app) {
    this.reset();
  }

  reset() {
    this.uuid = undefined;
    this.app = undefined;
    this.gameInstanceId = undefined;
    this.missiles = [];
    this.score = 0;
    this.hits = [];
  }

  start(gameView, gameInstanceId, uuid, pubnub, gameChannel) {
    this.gameChannel = gameChannel;
    this.pubnub = pubnub;
    this.uuid = uuid;
    this.gameInstanceId = gameInstanceId;
    this.app = new PIXI.Application({ width: 640, height: 360 });

    pubnub.setUUID(uuid);

    gameView.append(this.app.view);

    this.render();
    this.keyboard();
  }

  stop() {
    this.app.ticker.stop();
    this.app.destroy(true);
    this.reset();
  }

  render() {
    if (!this.app) {
      return;
    }

    let headerHeight = 30;

    let header = new PIXI.Graphics();
    header.beginFill(0x333333);
    header.lineStyle(1, 0xFFFFFF);
    header.drawRect(1, 1, 639, headerHeight - 2);

    this.app.stage.addChild(header);

    let text = new PIXI.Text('Score: 0',{fontFamily : 'Arial', fontSize: 16, fill : 0xCCCCCC, align : 'center'});
    text.x = 5;
    text.y = 5;

    this.app.stage.addChild(text);

    let enemy = PIXI.Sprite.from('/game/profile/box.png');

    this.app.stage.addChild(enemy);

    let elapsed = 0.0;
    let previousScore = this.score;
    this.app.ticker.add((delta) => {
      elapsed += delta;
      enemy.x = 300.0 + Math.cos(elapsed/50.0) * 300.0;
      enemy.y = headerHeight;

      let missilesToRemove = [];
      this.missiles.forEach((missile) => {
        if (missile.y > headerHeight) {
          missile.y -= 10;

          let missileLeft = missile.x;
          let missileRight = missile.x + missile.width;
          let missileTop = missile.y;
          let enemyLeft = enemy.x;
          let enemyRight = enemy.x + enemy.width;
          let enemyBottom = enemy.y + enemy.height;
          
          if (
            missileRight > enemyLeft &&
            missileLeft < enemyRight &&
            missileTop <= enemyBottom
          ) {
            if (!this.hits.includes(missile)) {
              this.hits.push(missile);
              this.score += 1;
              missilesToRemove.push(missile);
              this.app.stage.removeChild(missile);
            }
          }
        } else {
          missilesToRemove.push(missile);
          this.app.stage.removeChild(missile);
        }
      });

      missilesToRemove.forEach((missile, index) => {
        delete this.missiles[index];
      });

      if (this.moveLeft) {
        if (this.shooter.x > headerHeight) {
          this.shooter.x -= 4;
        }
      }

      if (this.moveRight) {
        if (this.shooter.x < 620) {
          this.shooter.x += 4;
        }
      }

      text.text = 'Score: ' + this.score;

      if (previousScore !== this.score) {
        previousScore = this.score;
        this.sendScore();
      }
    });


    let shooter = PIXI.Sprite.from('/game/profile/box.png');
    shooter.width = 20;
    shooter.height = 20;
    shooter.x = 320;
    shooter.y = 340;

    this.app.stage.addChild(shooter);

    this.shooter = shooter;
  }

  keyboard() {
    let leftArrow = 37;
    let rightArrow = 39;
    let space = 32;

    $(document).keydown((e) => {
      let key = e.which;


      if (key === leftArrow) {
        this.moveLeft = true;
      }

      if (key === rightArrow) {
        this.moveRight = true;
      }

      if (key === space) {
        this.fire();
      }
    });

    $(document).keyup((e) => {
      let key = e.which;

      console.log('key', key);

      if (key === leftArrow) {
        this.moveLeft = false;
      }

      if (key === rightArrow) {
        this.moveRight = false;
      }

    });
  }

  fire() {
    let missile = PIXI.Sprite.from('/game/profile/box.png');
    missile.width = 5;
    missile.height = 20;
    missile.x = this.shooter.x + 8;
    missile.y = 320;

    this.app.stage.addChild(missile);

    this.missiles.push(missile);
  }

  sendScore() {
    this.pubnub.publish({
      channel: this.gameChannel,
      message: {
        gameInstanceId: this.gameInstanceId,
        uuid: this.uuid, 
        stats: [
            {
                key: 'points', 
                value: this.score,
            }
        ]
      }
    });
  }
}

window.Game = Game;