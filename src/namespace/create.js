const { validate, post } = require('../common');

module.exports = async ({
  uri,
  token,
  clusterId,
  projectId,
  name,
}) => {
  validate({
    uri,
    token,
    clusterId,
    projectId,
    name,
  });
  const url = `${uri}/cluster/${clusterId}/namespaces`;
  const payload = { projectId, name };
  const { id, name: Name } = await post(url, token, payload);
  return { id, name: Name };
};
