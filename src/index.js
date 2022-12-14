const cluster = require('./cluster');
const ingress = require('./ingress');
const namespace = require('./namespace');
const project = require('./project');
const service = require('./service');
const workload = require('./workload');
const certificates = require('./certificates')

module.exports = {
  cluster,
  ingress,
  namespace,
  project,
  service,
  workload,
  certificates,
};
