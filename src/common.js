const fetch = require('node-fetch');

const { log } = console;
const { isArray } = Array;

const checkStatus = async (res) => {
  if (res.ok) return res; // res.status >= 200 && res.status < 300
  log('error response json', await res.json());
  throw new Error(res.statusText);
};

const authenticated = token => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });

module.exports = {
  /**
   * Ensures that all keys passed are present.
   */
  validate: (props = {}) => {
    const keys = Object.keys(props);
    const hop = Object.prototype.hasOwnProperty;
    const valid = keys.every(p => hop.call(props, p) && (props[p] || props[p] === false));
    if (!valid) throw new Error(`Missing a required key: ${JSON.stringify(keys)}`);
  },
  get: (url, token) => {
    const headers = authenticated(token);
    return fetch(url, { headers }).then(checkStatus).then(r => r.json());
  },
  post: (url, token, payload) => {
    const headers = authenticated(token);
    return fetch(url, { method: 'post', body: JSON.stringify(payload), headers })
      .then(checkStatus).then(r => r.json());
  },
  put: (url, token, payload) => {
    const headers = authenticated(token);
    return fetch(url, { method: 'put', body: JSON.stringify(payload), headers })
      .then(checkStatus).then(r => r.json());
  },

  label: (labels = {}, namespace, name) => {
    const workload = { 'workload.user.cattle.io/workloadselector': `deployment-${namespace}-${name}` };
    return Object.assign({}, { ...labels }, { ...workload });
  },

  configure: config => config || {
    maxSurge: 1,
    maxUnavailable: 0,
    minReadySeconds: 0,
    progressDeadlineSeconds: 600,
    revisionHistoryLimit: 10,
    strategy: 'RollingUpdate',
  },
  containerize: (containers = [], name) => {
    if (isArray(containers) && containers[0].image) return containers;
    return [{
      env: [],
      image: 'busybox:latest',
      imagePullPolicy: 'IfNotPresent',
      name,
      entrypoint: ['top'],
      securityContext: {
        allowPrivilegeEscalation: false,
        capabilities: {},
        privileged: false,
        procMount: 'Default',
        readOnlyRootFilesystem: false,
        runAsNonRoot: false,
      },
      stdin: true,
      terminationMessagePath: '/dev/termination-log',
      terminationMessagePolicy: 'File',
      tty: true,
    }];
  },
};
