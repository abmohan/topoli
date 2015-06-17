const bluebird    = require('bluebird');
const csv         = bluebird.promisifyAll(require('csv'));
const R           = require('ramda');
const xlsx        = require('xlsx');


module.exports = {
  getWorksheets: getWorksheets
};

/*
 * Takes an array of filenames of excel workbooks and returns an array of
 * workbook data. Each element in this workbook array is itself an array of
 * worksheet data (which itself is an array of rows)
 *
 */
function getWorksheets(fileArray, flatten, verbose) {

  // set default values for arguments
  flatten = flatten || false;
  verbose = verbose || false;

  // if only one array is present or if string pathname provided, force
  // flattening of results array
  if (!R.isArrayLike(fileArray) || fileArray.length <= 1) {
    flatten = true;
  }

  return bluebird.map(fileArray, getWorkbook)
      // get an array of worksheets (in CSV form) for each workbook
      .map(getRawWorksheetArray)
      // flatten all worksheets to a single array if requested
      .then(function (results) {
        return flatten ? R.flatten(results) : results;
      })
      // parse each of the individual CSV worksheets
      .map(function (result) {
        return csv.parseAsync(result);
      });


  // ------------ Function definitions --------------------

  /*
   * Returns a promise that resolves to the an excel workbook for
   * a given filename
   */
  function getWorkbook(filename) {

    if (verbose) {
      console.log("Loading excel workbook", filename);
    }

    return bluebird.resolve(xlsx.readFile(filename));
  }

  /*
   * Returns a promise that resolves to an array of worksheet data, in CSV form,
   * for a given workbook.
   */
  function getRawWorksheetArray(wb) {
    return wb.SheetNames.map(function (wsName) {
      return xlsx.utils.sheet_to_csv(wb.Sheets[wsName]);
    });
  }

}
