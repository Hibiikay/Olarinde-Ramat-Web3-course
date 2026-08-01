<h1>Mountains</h1>

<div id="mountains"></div>

<script>
  const MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
    {name: "Everest", height: 8848, place: "Nepal"},
    {name: "Mount Fuji", height: 3776, place: "Japan"},
    {name: "Vaalserberg", height: 323, place: "Netherlands"},
    {name: "Denali", height: 6168, place: "United States"},
    {name: "Popocatepetl", height: 5465, place: "Mexico"},
    {name: "Mont Blanc", height: 4808, place: "Italy/France"}
  ];

  function buildTable(data) {
    let table = document.createElement("table");

    // Header row
    let headerRow = document.createElement("tr");
    for (let key of Object.keys(data[0])) {
      let th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Data rows
    for (let obj of data) {
      let row = document.createElement("tr");
      for (let key of Object.keys(obj)) {
        let cell = document.createElement("td");
        cell.textContent = obj[key];
        // Right-align numbers
        if (typeof obj[key] === "number") {
          cell.style.textAlign = "right";
        }
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    return table;
  }

  document.getElementById("mountains").appendChild(buildTable(MOUNTAINS));
</script>
