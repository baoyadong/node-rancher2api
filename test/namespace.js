const { list, create } = require('../src/namespace');

const { log } = console;

module.exports = async (uri, token, clusterId, projectId) => {
  try {
    log('Listing namespaces');
    const namespaces = await list({
      uri,
      token,
      clusterId,
    });
    log('found', namespaces.length, 'namespaces!', namespaces.map(n => n.id));

    const createProps = {
      uri,
      clusterId,
      token,
      projectId,
      name: 'test-namespace',
    };

    const filtered = namespaces.filter(({ name }) => name === createProps.name);
    const namespace = filtered.length ? filtered[0] : await create(createProps);
    return namespace.id;
    //
  } catch (e) {
    log(e);
    process.exit(1);
  }
  return false;
};
