import { onRequest } from 'firebase-functions/v2/https';
  const server = import('firebase-frameworks');
  export const ssrkalikalihim = onRequest({"region":"asia-east1","maxInstances":1}, (req, res) => server.then(it => it.handle(req, res)));
  