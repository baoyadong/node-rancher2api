const { validate, get } = require('../common');

module.exports = async ({ uri, token }) => {
  validate({ uri, token });
  const url = `${uri}/clusters`;
  const { data } = await get(url, token);
  return data.map(({ id, name }) => ({ id, name }));
};
