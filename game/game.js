class Game {

  constructor (app) {
    this.reset();
  }

  reset() {
    this.uuid = undefined;
    this.app = undefined;
    this.gameInstanceId = undefined;
    this.missiles = [];

    // stats
    this.score = 0;
    this.shield = 100;
    this.ammo = 1000;
    this.shots = 0;
    this.speed = 0;

    // actions
    this.moveLeft = false;
    this.moveRight = false;
    this.fire = false;

    // fire
    this.firecounter = 0;
  }

  start(gameView, gameId, gameInstanceId, uuid, pubnub, gameGlobalChannel, gameChannel) {
    this.gameGlobalChannel = gameGlobalChannel;
    this.gameChannel = gameChannel;
    this.pubnub = pubnub;
    this.uuid = uuid;
    this.gameInstanceId = gameInstanceId;
    this.gameId = gameId;
    this.app = new PIXI.Application({ width: 640, height: 360 });

    pubnub.setUUID(uuid);

    gameView.append(this.app.view);

    this.render();
    this.sendScore();
    this.keyboard();

    this.sendScoreTimer = undefined;
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
      this.missiles.forEach((missile, index) => {
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
            this.score += 1;
            this.app.stage.removeChild(missile);
            missilesToRemove.push(index);
          }
        } else {
          this.app.stage.removeChild(missile);
          missilesToRemove.push(index);
        }
      });

      missilesToRemove.forEach((m) => {
        this.missiles.splice(m,1);
      });

      missilesToRemove = [];

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

      if (this.fire) {
        if (this.firecounter % 7 === 0) {
          let missile = PIXI.Sprite.from('/game/profile/box.png');
          missile.width = 5;
          missile.height = 10;
          missile.x = this.shooter.x + 8;
          missile.y = 320;
      
          this.app.stage.addChild(missile);
      
          this.missiles.push(missile);
        }

        this.firecounter += 1;
        this.shots += 1;
      }

      text.text = 'Score: ' + this.score;

      if (previousScore !== this.score) {
        previousScore = this.score;

        if (this.sendScoreTimer) {
          clearInterval(this.sendScoreTimer);
        }
        
        this.sendScoreTimer = setTimeout(() => {
          this.sendScore();
          this.sendScoreTimer = undefined;
        }, 500);
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
        this.fire = true;
      }
    });

    $(document).keyup((e) => {
      let key = e.which;

      if (key === leftArrow) {
        this.moveLeft = false;
      }

      if (key === rightArrow) {
        this.moveRight = false;
      }

      if (key === space) {
        this.fire = false;
        this.firecounter = 0;
      }

    });
  }

  sendScore() {
    this.pubnub.publish({
      channel: this.gameChannel,
      message: {
        gameInstanceId: this.gameInstanceId,
        playerId: this.uuid, 
        scores: [
          {
            key: 'points', 
            value: this.score,
          },
          {
            key: 'health', 
            value: this.shield,
          },
          {
            key: 'ammo', 
            value: this.ammo,
          },
          {
            key: 'shots', 
            value: this.shots,
          },
          {
            key: 'speed', 
            value: this.speed,
          }
        ]
      }
    });

    this.pubnub.publish({
      channel: this.gameGlobalChannel,
      message: {
        gameInstanceId: this.gameId,
        playerId: this.uuid, 
        scores: [
          {
            key: 'points', 
            value: this.score,
          },
          {
            key: 'health', 
            value: this.shield,
          },
          {
            key: 'ammo', 
            value: this.ammo,
          },
          {
            key: 'shots', 
            value: this.shots,
          },
          {
            key: 'speed', 
            value: this.speed,
          }
        ]
      }
    });
  }
}

window.Game = Game;