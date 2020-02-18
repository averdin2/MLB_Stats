// team variables
var teamId = "119";


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
    this.wins = wins || 0;
    this.losses = losses || 0;
  }
}

class Hitter {
  constructor(games, average, atBats, rbi, homeruns, walks, strikeOuts) {
    this.games = games || 0;
    this.average = average || 0;
    this.atBats = atBats || 0;
    this.rbi = rbi || 0;
    this.homeruns = homeruns || 0;
    this.walks = walks || 0;
    this.strikeOuts = strikeOuts || 0;
  }
}

var teamMembers = [];
var pitchers = [];
var hitters = [];

function getTeamStats(teamId) {
  if (teamMembers[0] != undefined) {
    teamMembers = [];
    pitchers = [];
    hitters = [];
    deleteTable(document.getElementById('pitchers'));
    deleteTable(document.getElementById('hitters'));
  }


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

    // actually sets the players for the webpage
    for (var p in pitchers) {
      //console.log(pitchers[p].name);
      lookupPitcherStats(pitchers[p]);
    }

    for (var h in hitters) {
      //console.log(hitters[h].name);
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
        setPitcherStats(stats, pitcher);
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
        setHitterStats(stats, hitter);
      })
    }

    function setPitcherStats(pitcherStats, pitcher) {
      pitcher.stats = pitcherStats;
      addPitcher(pitcher.name, pitcher.stats.games, pitcher.stats.era, pitcher.stats.gamesStarted, pitcher.stats.inningsPitched, pitcher.stats.wins, pitcher.stats.losses);
      //console.log(pitcher.name);
    }

    function setHitterStats(hitterStats, hitter) {
      hitter.stats = hitterStats;
      addHitter(hitter.name, hitter.stats.games, hitter.stats.average, hitter.stats.atBats, hitter.stats.rbi, hitter.stats.homeruns, hitter.stats.strikeOuts);
      //console.log(hitter.stats);
    }

    // adds pitcher to html pitchers table
    function addPitcher(pName, pG, pERA, pGS, pIP, pW, pL) {
      var pTable = document.getElementById("pitchers");
      var row = pTable.insertRow(pTable.rows.length);
      var name = row.insertCell(0);
      var g = row.insertCell(1);
      var era = row.insertCell(2);
      var gs = row.insertCell(3);
      var ip = row.insertCell(4);
      var w = row.insertCell(5);
      var l = row.insertCell(6);
      name.innerHTML = pName;
      g.innerHTML = pG;
      era.innerHTML = pERA;
      gs.innerHTML = pGS;
      ip.innerHTML = pIP;
      w.innerHTML = pW;
      l.innerHTML = pL;
    }

    // adds hitter to html hitters table
    function addHitter(hName, hG, hAVG, hAB, hRBI, hHR, hSO) {
      var hTable = document.getElementById("hitters");
      var row = hTable.insertRow(hTable.rows.length);
      var name = row.insertCell(0);
      var g = row.insertCell(1);
      var avg = row.insertCell(2);
      var ab = row.insertCell(3);
      var rbi = row.insertCell(4);
      var hr = row.insertCell(5);
      var so = row.insertCell(6);
      name.innerHTML = hName;
      g.innerHTML = hG;
      avg.innerHTML = hAVG;
      ab.innerHTML = hAB;
      rbi.innerHTML = hRBI;
      hr.innerHTML = hHR;
      so.innerHTML = hSO;
    }



  })

  function deleteTable(table) {
    while(table.rows.length != 1) {
      table.deleteRow(1);
    }
  }
}
