const { validate, post } = require('../common');

module.exports = async ({
  uri,
  token,
  projectId,
  namespaceId,
  name,
  targetWorkloadIds,
}) => {
  validate({
    uri,
    token,
    projectId,
    namespaceId,
    name,
    targetWorkloadIds,
  });
  const url = `${uri}/project/${projectId}/services`;
  const payload = {
    name,
    namespaceId,
    projectId,
    targetWorkloadIds,
  };
  const { id, name: Name } = await post(url, token, payload);
  return { id, name: Name };
};
