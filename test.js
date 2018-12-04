// team variables
var teamName = "";
var teamId = "";
var teamAbbrev = "";
var teamDivision = "";

// player variables
class Player {
  constructor(name, playerId, position, jerseyNum, bats, throws) {
    this.name = name;
    this.playerId = playerId;
    this.position = position;
    this.jerseyNum = jerseyNum;
    this.bats = bats;
    this.throws = throws;
    this.stats = "";
  }
}

class Pitcher {
  constructor(games, era, gamesStarted, wins, losses, inningsPitched) {
    this.games = games;
    this.era = era;
    this.gamesStarted = gamesStarted;
    this. wins = wins;
    this.losses = losses;
    this.inningsPitched = inningsPitched;
  }
}

var teamMembers = [40];
var pitchers = [];
var hitters = [];

// find the team (for now it will just be the dodgers)
$.getJSON("http://lookup-service-prod.mlb.com/json/named.team_all_season.bam?sport_code=%27mlb%27&all_star_sw=%27N%27&sort_order=name_asc&season=%272018%27&team_all_season.col_in=name_display_full,team_id,mlb_org_abbrev,division_full",
function(teams){
  //console.log(data);
  //console.log(data.team_all_season.queryResults.row[13].team_id);
  teamName = teams.team_all_season.queryResults.row[13].name_display_full;
  teamId = teams.team_all_season.queryResults.row[13].team_id;
  teamAbbrev = teams.team_all_season.queryResults.row[13].mlb_org_abbrev;
  teamDivision = teams.team_all_season.queryResults.row[13].division_full;
  //console.log(teamId);

  // get the 40 man roster of the team
  $.getJSON("http://lookup-service-prod.mlb.com/json/named.roster_40.bam?team_id=" + teamId + "&roster_40.col_in=position_txt,name_display_first_last,jersey_number,bats,throws,player_id",
  function(players){
    //console.log(players.roster_40.queryResults.row);
    for (var i in players.roster_40.queryResults.row) {
      teamMembers[i] = new Player(players.roster_40.queryResults.row[i].name_display_first_last,
        players.roster_40.queryResults.row[i].player_id,
        players.roster_40.queryResults.row[i].position_txt,
        players.roster_40.queryResults.row[i].jersey_number,
        players.roster_40.queryResults.row[i].bats,
        players.roster_40.queryResults.row[i].throws);
    }

    // differentiate pitchers and hitters
    for (var x of teamMembers) {
      if (x.position == "P") {
        pitchers.push(x);
      }
      else {
        hitters.push(x);
      }
    }
    // get individual player stats for pitchers
    console.log(teamMembers);
    console.log(pitchers);
    console.log(hitters);
  })
})
