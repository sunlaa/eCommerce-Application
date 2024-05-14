import {
  AnonymousAuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import fetch from 'node-fetch';
import tokenCache from './token_cache';
import { ByProjectKeyRequestBuilder, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

export default class ClientMaker {
  private httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: `${process.env.API_URL}`,
    fetch,
  };

  createAnonymousClient(): ByProjectKeyRequestBuilder {
    const options: AnonymousAuthMiddlewareOptions = {
      host: `${process.env.AUTH_URL}`,
      projectKey: `${process.env.PROJECT_KEY}`,
      credentials: {
        clientId: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.SECRET}`,
      },
      tokenCache,
      scopes: [`${process.env.SCOPE}`],
      fetch,
    };
    const client = new ClientBuilder()
      .withAnonymousSessionFlow(options)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.PROJECT_KEY as string,
    });
  }

  createPasswordClient(username: string, password: string): ByProjectKeyRequestBuilder {
    const options: PasswordAuthMiddlewareOptions = {
      host: `${process.env.AUTH_URL}`,
      projectKey: `${process.env.PROJECT_KEY}`,
      credentials: {
        clientId: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.SECRET}`,
        user: {
          username,
          password,
        },
      },
      scopes: [`${process.env.SCOPE}`],
      fetch,
    };

    const client = new ClientBuilder().withPasswordFlow(options).withHttpMiddleware(this.httpMiddlewareOptions).build();
    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.PROJECT_KEY as string,
    });
  }

  createExistingTokenClient(token: string): ByProjectKeyRequestBuilder {
    console.log('here');
    const client = new ClientBuilder()
      .withExistingTokenFlow(`Bearer ${token}`, { force: true })
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();
    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.PROJECT_KEY as string,
    });
  }
}
