const { list, create } = require('../src/project');
// const { list } = require('../src/project');

const { log } = console;

module.exports = async (uri, token, clusterId) => {
  try {
    log('Listing projects');
    const projects = await list({ uri, clusterId, token });
    log('found', projects.length, 'projects!');

    const createProps = {
      uri,
      clusterId,
      token,
      name: 'test project',
    };

    const filtered = projects.filter(({ name }) => name === createProps.name);
    const project = filtered.length ? filtered[0] : await create(createProps);
    return project.id;
    //
  } catch (e) {
    log(e);
    process.exit(1);
  }
  return false;
};
