let leaders = [
  {
      'playerId': '8e8047ff-666b-4435-b3f0-3cc571eace62',
      'score': 0.5,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  },
  {
      'playerId': 'b1070140-5eae-45e0-bca3-ff9c1b93dd01',
      'score': 11.5,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  },
  {
      'playerId': '7123e6ea-1efa-4cda-95f3-72ef1467a04b',
      'score': 23.5,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  },
  {
      'playerId': '3207fd3e-14c2-46d7-b672-736cbb8380f4',
      'score': 20.0,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  },
  {
      'playerId': 'ab58b1c3-45c8-4a2a-971e-c5be741a9b42',
      'score': 13.5,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  },
  {
      'playerId': 'rai',
      'score': 3.5,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  },
  {
      'playerId': '0f4421c3-a99d-4fa9-a5be-da96051f6b57',
      'score': 2.5,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  },
  {
      'playerId': 'john',
      'score': 5.0,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  },
  {
      'playerId': '8ecdb2cf-fd2f-4488-84df-0b1c5a656e9f',
      'score': 213.5,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  },
  {
      'playerId': 'drew',
      'score': 33.5,
      'gameInstanceId': 'bd1d4463-e995-4f5b-ba77-61aac21f9f3b'
  }
];

class Leaderboard {

  constructor () {
    this.board = undefined;
    this.players = [];
  }

  start (board, gameInstanceId, uuid, pubnub, channel) {
    this.channel = channel;
    this.pubnub = pubnub;
    this.uuid = uuid;
    this.gameInstanceId = gameInstanceId;
    this.board = board;

    this.update();
  }

  update () {
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
    
    leaders
      .sort((a, b) => {
        if ( a.points < b.points ){
          return -1;
        }
        if ( a.points > b.points ){
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
}

window.Leaderboard = Leaderboard;