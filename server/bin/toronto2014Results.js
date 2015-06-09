const bluebird    = require('bluebird');
const csv         = bluebird.promisifyAll(require('csv'));
const R           = require('ramda');
const xlsx        = require('xlsx');

const filesToImport = [
  '../data/results/Toronto/2014/MAYOR.xls',
  '../data/results/Toronto/2014/COUNCILLOR.xls'
];
const year = 2014;

function getWorkbook(filename) {
  return bluebird.resolve(xlsx.readFile(filename));
}

function getRawWorksheetArray(wb) {
  return wb.SheetNames.map(function (wsName) {
    return bluebird.resolve(xlsx.utils.sheet_to_csv(wb.Sheets[wsName]));
  });
}

function getWorksheets(fileArray) {

  return bluebird.map(fileArray, getWorkbook)
      .map(getRawWorksheetArray)
      .then(function (results) {
        return bluebird.resolve(R.flatten(results));
      })
      .map(function (result) {
        return csv.parseAsync(result);
      });
}

function parseTitleRow(titleRow) {
  var regex = /.*:\s+(\w*).*Ward:\s+(\S*)/i;

  var matches = titleRow.match(regex);

  if (matches) {
    return Promise.resolve({office: matches[1].trim(), wardNum: parseInt(matches[2])});
  } else {
    return Promise.reject("Error parsing title row " + titleRow);
  }

}

function transposeWorksheetData(worksheetRows) {

  return Promise.resolve(

    // transpose worksheet
    R.map(function (col) {
      return R.map(function (row) {
        return row[col];
      }, worksheetRows.slice(0, -1));
    }, R.keys(worksheetRows[0])).slice(0, -1)

  );

}

function groupWorksheetPollData(titleRowData, worksheetCols) {
  var wardNum = titleRowData.wardNum;
  var office = titleRowData.office;

  var candidates = worksheetCols[0].slice(2);
  var pollDataArray =  worksheetCols.slice(1);

  return Promise.resolve(
    R.reduce(function (mappedPollData, pollData) {

      var pollNum = parseInt(pollData[1]);
      var resultsArray = R.map(function (result) {
          return parseInt(result);
        }, pollData.slice(2));

      var key = `w${wardNum}p${pollNum}`;
      mappedPollData[key] = {
        office: office,
        year: year,
        wardNum: wardNum,
        pollNum: pollNum,
        voteCounts: R.zipWith(function (candidate, votes) {
          return {
              candidate: candidate,
              votes: votes
            };
          }, candidates, resultsArray)
      };

      return mappedPollData;

    }, {}, pollDataArray)

  );

}

function parseWorksheetData(worksheetData) {
  return bluebird.join(
      parseTitleRow(worksheetData[0][0]),
      transposeWorksheetData(worksheetData),
      groupWorksheetPollData
    );
}

function mergeWorksheets(parsedWorksheetArray) {
  return Promise.resolve(
    R.mergeAll(parsedWorksheetArray)
  );
}

function getAll() {
  return getWorksheets(filesToImport)
    .map(parseWorksheetData)
    .then(mergeWorksheets)
    .catch(function (err) {
      console.error("Error retrieving Toronto 2014 results", err);
    });
}


module.exports.getAll = getAll;
