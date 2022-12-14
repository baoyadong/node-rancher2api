const { validate, put } = require('../common');

module.exports = async ({
  uri,
  token,
  projectId,
  ingressId,
  rules = [],
}) => {
  validate({
    uri,
    token,
    projectId,
    ingressId,
    rules,
  });
  const url = `${uri}/project/${projectId}/ingresses/${ingressId}`;
  const payload = {
    rules,
  };
  return put(url, token, payload);
};
