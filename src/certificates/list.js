const { validate, get } = require('../common');

module.exports = async ({ uri, token, projectId }) => {
  validate({
    uri,
    token,
    projectId,
  });
  const url = `${uri}/project/${projectId}/certificates`;
  const { data } = await get(url, token);
  return data.map(({ id, name }) => ({ id, name }));
};
