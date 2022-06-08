const papa = require("papaparse");

async function drawChartCsv(csvData) {
  const parsed = papa.parse(csvData);
  return parsed;
}
