const { validate, post } = require('../common');

module.exports = async ({
  uri,
  token,
  clusterId,
  name,
}) => {
  validate({ uri, clusterId, token });
  const url = `${uri}/cluster/${clusterId}/projects`;
  const payload = { clusterId, name };
  const { id, name: Name } = await post(url, token, payload);
  return { id, name: Name };
};
