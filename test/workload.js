const { list, create, update } = require('../src/workload');

const { log } = console;

const securityContext = {
  allowPrivilegeEscalation: false,
  privileged: false,
  procMount: 'Default',
  readOnly: false,
  runAsNonRoot: false,
  resources: {
    limits: {
      cpu: '500m',
      memory: '128Mi',
    },
    requests: {
      cpu: '100m',
      memory: '32Mi',
    },
  },
  terminationMessagePath: '/dev/termination-log',
  terminationMessagePolicy: 'File',
};
const healthCheck = {
  failureThreshold: 3,
  path: '/_health',
  port: 80,
  scheme: 'HTTP',
  initialDelaySeconds: 10,
  periodSeconds: 2,
  successThreshold: 1,
  timeoutSeconds: 2,
  tcp: false,
  // type: '/v3/project/schemas/probe',
};

const containerSpecs = {
  imagePullPolicy: 'IfNotPresent',
  livenessProbe: healthCheck,
  readinessProbe: healthCheck,
  stdin: true,
  tty: true,
  ...securityContext,
};

const containerSpecGraphQL = {
  ...containerSpecs,
  command: ['node', 'src/index.js'],
  environment: {
    MONGO_DSN: 'mongodb://rs01.aerilon.baseplatform.io/?replicaSet=platform-aerilon&connectTimeoutMS=200&readPreference=primaryPreferred',
    TENANT_KEY: 'tenantKey',
  },
  image: 'basecms/base-cms:v0.5.0',
  name: 'graphql',
  workingDir: '/base-cms/services/graphql-server',
};

const containerSpecWebsite = {
  ...containerSpecs,
  environment: {
    GRAPHQL_URI: 'http://graphql',
  },
  image: 'endeavorb2b/website-blank:v0.0.1',
  name: 'website',
};

const containerSpecCron = {
  ...containerSpecs,
  command: ['https://google.com', '-fsSL'],
  image: 'appropriate/curl:latest',
  name: 'cron',
};

const cronJobConfig = {
  concurrencyPolicy: 'Allow',
  failedJobsHistoryLimit: 10,
  schedule: '* * * * *',
  successfulJobsHistoryLimit: 10,
  suspend: false,
};

module.exports = async (uri, token, clusterId, projectId, namespaceId) => {
  try {
    log('Listing workloads');
    const workloads = await list({
      uri,
      token,
      clusterId,
      projectId,
    });
    // log(workloads);
    log('found', workloads.length, 'workloads!', workloads.map(n => n.id));

    const created = await Promise.all([
      { name: 'graphql', containers: [containerSpecGraphQL] },
      { name: 'website', containers: [containerSpecWebsite] },
      { name: 'cron', containers: [containerSpecCron], cronJobConfig },
    ].map(async ({ name, containers, cronJobConfig: cron }) => {
      const filtered = workloads.filter(d => d.name === name);
      if (!filtered.length) {
        const createProps = {
          uri,
          token,
          projectId,
          namespaceId,
          name,
          containers,
          cronJobConfig: cron,
        };
        log('creating workload', name);
        return { name, workload: await create(createProps) };
      }
      return { name, workload: filtered[0] };
    }));

    const workloadId = created[0].id || 'deployment:test-namespace:graphql';
    const payload = {
      uri,
      token,
      projectId,
      workloadId,
      containers: [containerSpecGraphQL],
      // labels: {
      //   'workload.user.cattle.io/workloadselector': `deployment-${namespaceId}-graphql`,
      //   updated: 'true',
      // },
    };
    payload.containers[0].environment.UPDATED = 'true';

    log('Updating service');
    await update(payload);
    return created;

    //
  } catch (e) {
    log(e);
    process.exit(1);
  }
  return false;
};
