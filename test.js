window.onload = function() {
  // adds pitcher to html pitchers table
  function addPitcher() {
    var pTable = document.getElementById("pitchers");
    var row = pTable.insertRow(pTable.rows.length);
    var name = row.insertCell(0);
    var g = row.insertCell(1);
    var era = row.insertCell(2);
    var gs = row.insertCell(3);
    var ip = row.insertCell(4);
    var w = row.insertCell(5);
    var l = row.insertCell(6);
    name.innerHTML = "Clayton Kershaw";
    g.innerHTML = "0";
    era.innerHTML = "0";
    gs.innerHTML = "0";
    ip.innerHTML = "0";
    w.innerHTML = "0";
    l.innerHTML = "0";
  }

  // adds hitter to html hitters table
  function addHitter() {
    var hTable = document.getElementById("Hitters");
    var row = hTable.insertRow(hTable.rows.length);
    var name = row.insertCell(0);
    var g = row.insertCell(1);
    var avg = row.insertCell(2);
    var ab = row.insertCell(3);
    var rbi = row.insertCell(4);
    var hr = row.insertCell(5);
    var so = row.insertCell(6);
    name.innerHTML = "Clayton Kershaw";
    g.innerHTML = "0";
    avg.innerHTML = "0";
    ab.innerHTML = "0";
    rbi.innerHTML = "0";
    hr.innerHTML = "0";
    so.innerHTML = "0";
  }
}
