class Leaderboard {

  constructor () {
    this.board = undefined;
    this.players = [];
  }

  start (board) {
    this.pubnub = new PubNub({
      publishKey : "myPublishKey",
      subscribeKey : "mySubscribeKey",
      uuid: "myUniqueUUID"
    });

    this.board = $(board);
    this.update();
  }

  update () {
    this.board.html('<div>board</div>');
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