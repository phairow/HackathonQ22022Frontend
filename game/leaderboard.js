class Leaderboard {

  constructor () {
    this.board = undefined;
    this.players = [];
  }

  start (board, gameInstanceId, uuid, pubnub) {
    this.pubnub = pubnub;
    this.uuid = uuid;
    this.gameInstanceId = gameInstanceId;
    this.board = board;

    this.update();
  }

  update () {
    this.board.html(`
      <div>
        leader board
      </div>
    `);
  }

  getProfilePic(uuid) {
    if ([ 'john', 'drew', 'rai' ]) {
      return uuid;
    } else {
      return 'box';
    }
  }
}

window.leaderboard = new Leaderboard();