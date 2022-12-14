const { validate, post } = require('../common');

module.exports = async ({
  uri,
  token,
  projectId,
  namespaceId,
  name,
  rules = [],
  tls
}) => {
  validate({
    uri,
    token,
    projectId,
    name,
    namespaceId,
  });
  const url = `${uri}/project/${projectId}/ingresses`;
  const payload = {
    name,
    namespaceId,
    projectId,
    rules,
    tls,
  };
  const { id, name: Name } = await post(url, token, payload);
  return { id, name: Name };
};
