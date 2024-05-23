import { apiProjectClient } from './admin_client';

export async function deleteAllProducts() {
  const products = await apiProjectClient
    .products()
    .get({ queryArgs: { limit: 250 } })
    .execute()
    .then((response) => response.body.results);
  for (const product of products) {
    await apiProjectClient
      .products()
      .withId({ ID: product.id })
      .delete({ queryArgs: { version: product.version } })
      .execute();
  }
}
