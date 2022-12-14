const {
  validate,
  put,
  configure,
} = require('../common');

module.exports = async ({
  uri,
  token,
  projectId,
  workloadId,
  deploymentConfig,
  containers = [],
  labels = {},
  cronJobConfig,
}) => {
  validate({
    uri,
    token,
    projectId,
    workloadId,
    containers,
  });
  const url = `${uri}/project/${projectId}/workloads/${workloadId}`;
  const payload = {
    deploymentConfig: configure(deploymentConfig),
    containers,
    labels,
    cronJobConfig,
  };
  if (!Object.keys(labels).length) delete payload.labels;
  return put(url, token, payload);
};
