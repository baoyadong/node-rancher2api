const {
  validate,
  post,
  configure,
  containerize,
  label,
} = require('../common');

module.exports = async ({
  uri,
  token,
  projectId,
  namespaceId,
  name,
  deploymentConfig,
  containers = [],
  labels = {},
  cronJobConfig,
}) => {
  validate({
    uri,
    token,
    projectId,
    name,
    namespaceId,
  });
  const url = `${uri}/project/${projectId}/workloads`;
  const payload = {
    name,
    namespaceId,
    projectId,
    deploymentConfig: configure(deploymentConfig),
    containers: containerize(containers, name),
    labels: label(labels, namespaceId, name),
    cronJobConfig,
  };
  if (!Object.keys(labels).length) delete payload.labels;
  const { id, name: Name } = await post(url, token, payload);
  return { id, name: Name };
};
