import {
  AnonymousAuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
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
      scopes: [`${process.env.SCOPE}`],
      fetch,
    };
    const client = new ClientBuilder()
      .withAnonymousSessionFlow(options)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.PROJECT_KEY as string,
    });

    // apiRoot
    //   .me()
    //   .carts()
    //   .post({ body: { currency: 'EUR' } })
    //   .execute()
    //   .catch((err) => console.log(err));

    return apiRoot;
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
      tokenCache,
      scopes: [`${process.env.SCOPE}`],
      fetch,
    };

    const client = new ClientBuilder().withPasswordFlow(options).withHttpMiddleware(this.httpMiddlewareOptions).build();
    const apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.PROJECT_KEY as string,
    });

    // apiRoot
    //   .me()
    //   .carts()
    //   .get()
    //   .execute()
    //   .then((resp) => CartsClearing(resp.body.results))
    //   .catch((err) => console.log(err));
    apiRoot
      .get()
      .execute()
      .catch(() => {});
    return apiRoot;
  }

  createExistingTokenClient(token: string): ByProjectKeyRequestBuilder {
    const client = new ClientBuilder()
      .withExistingTokenFlow(`Bearer ${token}`, { force: true })
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.PROJECT_KEY as string,
    });
  }

  createRefreshTokenClient(refreshToken: string): ByProjectKeyRequestBuilder {
    const options: RefreshAuthMiddlewareOptions = {
      host: `${process.env.AUTH_URL}`,
      projectKey: `${process.env.PROJECT_KEY}`,
      credentials: {
        clientId: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.SECRET}`,
      },
      refreshToken,
      fetch,
    };

    const client = new ClientBuilder()
      .withRefreshTokenFlow(options)
      .withHttpMiddleware(this.httpMiddlewareOptions)
      .build();

    return createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: process.env.PROJECT_KEY as string,
    });
  }
}
