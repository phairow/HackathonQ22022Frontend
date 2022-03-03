class Leaderboard {

  constructor() {
    this.board = undefined;
    this.players = [];
    this.leaders = [];
  }

  start(board, gameInstanceId, uuid, channel) {
    this.channel = channel;
    this.uuid = uuid;
    this.gameInstanceId = gameInstanceId;
    this.board = board;

    this.update();
  }

  update() {
    this.board.html('');
    
    this.board.append(`
      <div class="board_${gameInstanceId}">
        <div class="leaderboard-row leaderboard-header">
          <div class="leaderboard-column-pic">
            
          </div>
          <div class="leaderboard-column-name">
            Player
          </div>
          <div class="leaderboard-column-score">
            Score
          </div>
        </div>
      </div>`);

    let boardView = this.board.children(`.board_${gameInstanceId}`)
    
    this.leaders
      .slice()
      .sort((a, b) => {
        if ( a.score < b.score ){
          return -1;
        }
        if ( a.score > b.score ){
          return 1;
        }
        return 0;
      })
      .reverse()
      .forEach((player) => {
        boardView.append(this.getRow(player))
      });
  }

  getRow(player) {
    let profile = this.getProfile(player.playerId);
    
    return `
      <div class="leaderboard-row">
      <div class="leaderboard-column-pic">
        <img style="width:20px" src="/game/profile/${profile.playerPic}"/>
      </div>
      <div class="leaderboard-column-name">
        ${profile.playerName}
      </div>
      <div class="leaderboard-column-score">
        ${player.score}
      </div>
      </div>
    `;
  }

  getProfile(uuid) {
    let playerName = uuid;
    let playerPic = 'box.png';

    if ([ 'john', 'drew', 'rai' ].includes(uuid)) {
      playerName = uuid.charAt(0).toUpperCase() + uuid.slice(1);
      playerPic = `${uuid}.jpeg`;
    }

    return {
      playerName,
      playerPic,
    };
  }

  setLeaders(leaders) {
    this.leaders =  leaders;
    this.update();s
  }
}

window.Leaderboard = Leaderboard;