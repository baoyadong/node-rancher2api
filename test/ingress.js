const { list, create, update } = require('../src/ingress');

const { log } = console;

module.exports = async (uri, token, clusterId, projectId, namespaceId) => {
  try {
    log('Listing ingresses');
    const ingresses = await list({
      uri,
      token,
      clusterId,
      projectId,
    });
    // log(ingresses);
    log('found', ingresses.length, 'ingresses!', ingresses.map(n => n.id));

    const gqlHost = 'graphql.base-cms.io';
    const xipHost = 'balancer.test-namespace.10.0.8.155.xip.io';
    const webHost = 'next.test.com';
    const gqlIds = ['deployment:test-namespace:graphql'];
    const webIds = ['deployment:test-namespace:website'];
    const targetPort = 80;

    const createProps = {
      uri,
      token,
      clusterId,
      projectId,
      namespaceId,
      name: 'balancer',
      rules: [
        {
          host: gqlHost,
          paths: [
            {
              path: '/test/test',
              targetPort,
              // type: '/v3/project/schemas/httpIngressPath',
              workloadIds: gqlIds,
            },
          ],
          // type: '/v3/project/schemas/ingressRule'
        },
        {
          host: xipHost,
          paths: [
            {
              // serviceId: null,
              targetPort,
              // type: '/v3/project/schemas/httpIngressPath',
              workloadIds: webIds,
              // type: '/v3/project/schemas/ingressRule',
            },
          ],
          // type: '/v3/project/schemas/ingressRule'
        },
        {
          host: webHost,
          paths: [
            {
              // serviceId: null,
              targetPort,
              // type: '/v3/project/schemas/httpIngressPath',
              workloadIds: webIds,
              // type: '/v3/project/schemas/ingressRule',
            },
          ],
          // type: '/v3/project/schemas/ingressRule'
        },
      ],
    };

    const filtered = ingresses.filter(i => i.name === createProps.name);
    const { id: ingressId } = filtered.length ? filtered[0] : await create(createProps);

    const updatedRules = createProps.rules;
    updatedRules[0].paths.push({
      path: '/test2/test2',
      targetPort,
      workloadIds: gqlIds,
    });

    const updateProps = {
      uri,
      token,
      projectId,
      ingressId,
      rules: updatedRules,
    };

    const updated = await update(updateProps);
    return updated;

    //
  } catch (e) {
    log(e);
    process.exit(1);
  }
  return false;
};
