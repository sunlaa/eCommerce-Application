import fetch from 'node-fetch';
import { ClientBuilder, type AuthMiddlewareOptions, type HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

const projectKey = 'vinyl-commerce';
const clientSecret = 'CwmoKc1EyPaSozs_3ENzRGwUtv-ygrJY';
const clientId = 'nrYhpx2P6YrpIilI0luFd9Io';
const authUrl = 'https://auth.europe-west1.gcp.commercetools.com';
const apiUrl = 'https://api.europe-west1.gcp.commercetools.com';

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
