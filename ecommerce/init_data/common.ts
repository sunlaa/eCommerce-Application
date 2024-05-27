import { apiProjectClient } from './admin_client';

export async function deleteAllProducts(productType: string) {
  const products = await apiProjectClient
    .products()
    .get({ queryArgs: { limit: 250 } })
    .execute()
    .then((response) => response.body.results);
  const productTypeToDelete = await apiProjectClient
    .productTypes()
    .get()
    .execute()
    .then((response) => response.body.results.find((item) => item.key === productType));
  if (!productTypeToDelete) {
    console.log(`Product type ${productType} not found`);
    return;
  }
  for (const product of products) {
    if (product.productType.id !== productTypeToDelete.id) {
      console.log(`Skipping ${JSON.stringify(product.productType)}`);
      continue;
    }
    await apiProjectClient
      .products()
      .withId({ ID: product.id })
      .delete({ queryArgs: { version: product.version } })
      .execute();
  }
}
