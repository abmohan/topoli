'use strict';

const localDevUri = 'mongodb://localhost/topoli';

module.exports = {
  uri : process.env.MONGOLAB_URI || localDevUri
}
