const bluebird    = require('bluebird');
const csv         = bluebird.promisifyAll(require('csv'));
const R           = require('ramda');
const xlsx        = require('xlsx');

const excelTools  = require('./excelTools');

const filesToImport = [
  '../data/results/Toronto/2014/MAYOR.xls',
  '../data/results/Toronto/2014/COUNCILLOR.xls'
];
const year = 2014;


module.exports.getAll = getAll;

function getAll() {
  return excelTools.getWorksheets(filesToImport, flatten=true, verbose=true)
    .then(function (result) {
      return result;
    })
    .map(parseWorksheetData)
    .then(R.flatten);

}

function parseWorksheetData(worksheetData) {
  return bluebird.join(
      parseTitleRow(worksheetData[0][0]),
      transposeWorksheetData(worksheetData),
      groupWorksheetPollData
    );
}

/*
 * Takes the title row of a spreadsheet from the Toronto2014 results and returns
 * a promise which resolves to an object with keys `office` and `wardNum`.
 */
function parseTitleRow(titleRow) {
  var regex = /.*:\s+(\w*).*Ward:\s+(\S*)/i;

  var matches = titleRow.match(regex);

  if (matches) {
    return bluebird.resolve(
      {
        office: matches[1].trim(),
        wardNum: parseInt(matches[2])
      }
    );

  } else {
    return bluebird.reject("Error parsing title row " + titleRow);
  }

}

function transposeWorksheetData(worksheetRows) {

  return bluebird.resolve(

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

  return bluebird.map(pollDataArray, function (pollData) {

    var pollNum = parseInt(pollData[1]);

    var resultsArray = R.map(function (result) {
        return parseInt(result);
      }, pollData.slice(2));

    var voteCount = R.zipWith(function (candidate, votes) {
      return {
          candidate: candidate,
          votes: votes
        };
      }, candidates, resultsArray);

    return {
      office: office,
      year: year,
      wardNum: wardNum,
      pollNum: pollNum,
      voteCounts: voteCount
    };

    return mappedPollData;

  });

}
