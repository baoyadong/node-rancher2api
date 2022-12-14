const { list, create } = require('../src/service');

const { log } = console;

module.exports = async (uri, token, projectId, namespaceId, workloads) => {
  try {
    log('Listing services');
    const services = await list({
      uri,
      token,
      projectId,
    });
    // log(services);
    log('found', services.length, 'services!', services.map(n => n.id));

    return Promise.all(workloads.map((workload) => {
      const filtered = services.filter(svc => svc.name === workload.name);
      if (filtered.length) {
        log(`Found service ${workload.name}`);
        return filtered[0];
      }

      log(`Creating service ${workload.name} ${workload.id}`);
      return create({
        uri,
        token,
        projectId,
        namespaceId,
        name: workload.name,
        targetWorkloadIds: [workload.id],
      });
    }));

    //
  } catch (e) {
    log(e);
    process.exit(1);
  }
  return false;
};
