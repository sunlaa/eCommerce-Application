import fetch from 'node-fetch';
import { ClientBuilder, type AuthMiddlewareOptions, type HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = 'ea';
const clientId = 'z0sL-lcrMpCnvj4wXd3x9KV_';
const clientSecret = 'ZXsSA2QYJ133XL2UAzh9zwqBmnmN-en_';
const authUrl = 'https://auth.eu-central-1.aws.commercetools.com';
const apiUrl = 'https://api.eu-central-1.aws.commercetools.com';

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey: projectKey,
  credentials: {
    clientId: clientId,
    clientSecret: clientSecret,
  },
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

export const apiProjectClient = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: projectKey });
