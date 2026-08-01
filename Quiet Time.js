async function activityTable(day) {
  // Create an array of 24 zeros (one for each hour)
  let table = new Array(24).fill(0);

  // Read the list of log files
  let logFileList = await textFile("camera_logs.txt");

  // Read all log files in parallel
  let logFiles = await Promise.all(
    logFileList.trim().split("\n").map(textFile)
  );

  // Process every timestamp
  for (let log of logFiles) {
    for (let timestamp of log.trim().split("\n")) {
      let date = new Date(Number(timestamp));

      if (date.getDay() === day) {
        table[date.getHours()]++;
      }
    }
  }

  return table;
}

activityTable(1)
  .then(table => console.log(activityGraph(table)));
