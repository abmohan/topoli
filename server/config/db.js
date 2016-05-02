const localDevUri = '//localhost/topoli';

module.exports = {
  uri: process.env.POSTGRES_URI || localDevUri
};
