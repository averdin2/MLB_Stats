// team variables
var teamName = "";
var teamId = "";
var teamAbbrev = "";
var teamDivision = "";

// season year
var season = "2018"

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
  constructor(era, games, gamesStarted, inningsPitched, wins, losses) {
    this.games = games || 0;
    this.era = era || 0;
    this.gamesStarted = gamesStarted || 0;
    this.inningsPitched = inningsPitched || 0;
    this. wins = wins || 0;
    this.losses = losses || 0;
  }
}

class Hitter {
  constructor(games, average, atBats, rbi, homeruns, walks, strikeOuts) {
    this.games = games || 0;
    this.average = average || 0;
    this.atBats = atBats || 0;
    this.rbi = rbi || 0;
    this. homeruns = homeruns || 0;
    this.walks = walks || 0;
    this.strikeOuts = strikeOuts || 0;
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
    for (var p in pitchers) {
      console.log(pitchers[p].name);
      lookupPitcherStats(pitchers[p]);
    }

    for (var h in hitters) {
      console.log(hitters[h].name);
      lookupHitterStats(hitters[h]);
    }

    function lookupPitcherStats(pitcher) {
      var stats = new Pitcher();
      $.getJSON("http://lookup-service-prod.mlb.com/json/named.sport_pitching_tm.bam?league_list_id='mlb'&game_type='R'&season=" + season + "&teamId='119'&player_id=" + pitcher.playerId + "&sport_pitching_tm.col_in=g,era,gs,w,l,ip",
      function(pStats){
        //console.log(pStats);
        if (pStats.sport_pitching_tm.queryResults.row == undefined) {
          stats;
        }
        else if (pStats.sport_pitching_tm.queryResults.row.length > 1) {
          stats.era = pStats.sport_pitching_tm.queryResults.row[pStats.sport_pitching_tm.queryResults.row.length - 1].era;
          stats.games = pStats.sport_pitching_tm.queryResults.row[pStats.sport_pitching_tm.queryResults.row.length - 1].g;
          stats.gamesStarted = pStats.sport_pitching_tm.queryResults.row[pStats.sport_pitching_tm.queryResults.row.length - 1].gs;
          stats.inningsPitched = pStats.sport_pitching_tm.queryResults.row[pStats.sport_pitching_tm.queryResults.row.length - 1].ip;
          stats.wins = pStats.sport_pitching_tm.queryResults.row[pStats.sport_pitching_tm.queryResults.row.length - 1].w;
          stats.losses = pStats.sport_pitching_tm.queryResults.row[pStats.sport_pitching_tm.queryResults.row.length - 1].l;
        }
        else {
          stats.era = pStats.sport_pitching_tm.queryResults.row.era;
          stats.games = pStats.sport_pitching_tm.queryResults.row.g;
          stats.gamesStarted = pStats.sport_pitching_tm.queryResults.row.gs;
          stats.inningsPitched = pStats.sport_pitching_tm.queryResults.row.ip;
          stats.wins = pStats.sport_pitching_tm.queryResults.row.w;
          stats.losses = pStats.sport_pitching_tm.queryResults.row.l;
        }
        //callback(stats);
        getPitcherStats(stats, pitcher);
      })
    }

    function lookupHitterStats(hitter) {
      var stats = new Hitter();
      $.getJSON("http://lookup-service-prod.mlb.com/json/named.sport_hitting_tm.bam?league_list_id='mlb'&game_type='R'&season=" + season + "&teamId='119'&player_id=" + hitter.playerId + "&sport_hitting_tm.col_in=g,avg,ab,rbi,hr,bb,so",
      function(hStats){
        //console.log(pStats);
        if (hStats.sport_hitting_tm.queryResults.row == undefined) {
          stats;
        }
        else if (hStats.sport_hitting_tm.queryResults.row.length > 1) {
          stats.games = hStats.sport_hitting_tm.queryResults.row[hStats.sport_hitting_tm.queryResults.row.length - 1].g;
          stats.average = hStats.sport_hitting_tm.queryResults.row[hStats.sport_hitting_tm.queryResults.row.length - 1].avg;
          stats.atBats = hStats.sport_hitting_tm.queryResults.row[hStats.sport_hitting_tm.queryResults.row.length - 1].ab;
          stats.rbi = hStats.sport_hitting_tm.queryResults.row[hStats.sport_hitting_tm.queryResults.row.length - 1].rbi;
          stats.homeruns = hStats.sport_hitting_tm.queryResults.row[hStats.sport_hitting_tm.queryResults.row.length - 1].hr;
          stats.walks = hStats.sport_hitting_tm.queryResults.row[hStats.sport_hitting_tm.queryResults.row.length - 1].bb;
          stats.strikeOuts = hStats.sport_hitting_tm.queryResults.row[hStats.sport_hitting_tm.queryResults.row.length - 1].so;
        }
        else {
          stats.games = hStats.sport_hitting_tm.queryResults.row.g;
          stats.average = hStats.sport_hitting_tm.queryResults.row.avg;
          stats.atBats = hStats.sport_hitting_tm.queryResults.row.ab;
          stats.rbi = hStats.sport_hitting_tm.queryResults.row.rbi;
          stats.homeruns = hStats.sport_hitting_tm.queryResults.row.hr;
          stats.walks = hStats.sport_hitting_tm.queryResults.row.bb;
          stats.strikeOuts = hStats.sport_hitting_tm.queryResults.row.so;
        }
        getHitterStats(stats, hitter);
      })
    }

    function getPitcherStats(pitcherStats, pitcher) {
      pitcher.stats = pitcherStats;
      console.log(pitcher);
    }

    function getHitterStats(hitterStats, hitter) {
      hitter.stats = hitterStats;
      console.log(hitter.stats);
    }

  })
})
