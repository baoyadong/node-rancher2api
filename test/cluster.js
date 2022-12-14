const { list } = require('../src/cluster');

const { log } = console;

module.exports = async (uri, token) => {
  try {
    log('Listing clusters');
    const clusters = await list({ uri, token });
    log(clusters);
    const cluster = clusters.filter(({ name }) => name === 'base-cms');
    return cluster[0].id;
    //
  } catch (e) {
    log(e);
    process.exit(1);
  }
  return false;
};
