window.onload = function() {
  var pTable = document.getElementById("table");
  var row = pTable.insertRow(pTable.rows.length);
  var name = row.insertCell(0);
  var g = row.insertCell(1);

  name.innerHTML = "Clayton Kershaw";
  g.innerHTML = "0";

  deleteTable(pTable);

  function deleteTable(table) {
    while(table.rows.length != 0) {
      table.deleteRow(0);
    }
  }
}
