const { validate, get } = require('../common');

module.exports = async ({ uri, clusterId, token }) => {
  validate({ uri, token, clusterId });
  const url = `${uri}/clusters/${clusterId}/projects`;
  const { data } = await get(url, token);
  return data.map(({ id, name }) => ({ id, name }));
};
