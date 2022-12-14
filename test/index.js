const cluster = require('./cluster');
const project = require('./project');
const namespace = require('./namespace');
const workload = require('./workload');
const ingress = require('./ingress');
const service = require('./service');

const { log } = console;
const uri = process.env.RANCHER_URL;
const token = process.env.RANCHER_TOKEN;

process.on('unhandledRejection', (e) => {
  log('> Unhandled promise rejection. Throwing error...');
  throw e;
});

const main = async () => {
  // Test cluster methods
  const clusterId = await cluster(uri, token);

  // Test project methods
  const projectId = await project(uri, token, clusterId);

  // Test namespace methods
  const namespaceId = await namespace(uri, token, clusterId, projectId);

  // Test workload methods
  const workloads = await workload(uri, token, clusterId, projectId, namespaceId);
  const workloadIds = workloads.map(({ workload: w }) => w.id);
  log('workloads', workloadIds);

  // Test service methods
  const w = workloads.map(({ workload: wo }) => wo);
  const services = await service(uri, token, projectId, namespaceId, w);
  log('services', services);

  // Test ingress methods
  const balancer = await ingress(uri, token, clusterId, projectId, namespaceId, workloadIds);
  log('ingress', balancer.id);

  //
};
main();
