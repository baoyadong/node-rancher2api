const { validate, get } = require('../common');

module.exports = async ({ uri, token, clusterId }) => {
  validate({ uri, token, clusterId });
  const url = `${uri}/clusters/${clusterId}/namespaces`;
  const { data } = await get(url, token);
  return data.map(({ id, projectId, name }) => ({ id, projectId, name }));
};
