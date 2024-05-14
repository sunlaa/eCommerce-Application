import {
  AnonymousAuthMiddlewareOptions,
  Client,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import fetch from 'node-fetch';
import tokenCache from './token_cache';

export default class ClientMaker {
  private httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: `${process.env.API_URL}`,
    fetch,
  };

  createAnonymousClient(): Client {
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
    return new ClientBuilder().withAnonymousSessionFlow(options).withHttpMiddleware(this.httpMiddlewareOptions).build();
  }

  createPasswordClient(username: string, password: string): Client {
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
    return new ClientBuilder().withPasswordFlow(options).withHttpMiddleware(this.httpMiddlewareOptions).build();
  }

  createExistingTokenClient(token: string) {
    return new ClientBuilder().withExistingTokenFlow(`Bearer ${token}`, { force: true });
  }
}
