import { apiProjectClient } from './admin_client';
import { deleteAllProducts } from './common';
import { ProductTypeDraft } from '@commercetools/platform-sdk';

const desiredProductTypes: ProductTypeDraft[] = [
  {
    key: 'vinyl',
    name: 'Vinyl records',
    description: 'Vinyl records for listening to your favorite music',
    attributes: [
      { name: 'year', type: { name: 'number' }, isRequired: true, label: { en: 'Year' } },
      { name: 'color', type: { name: 'text' }, isRequired: true, label: { en: 'Color' } },
      { name: 'artist', type: { name: 'text' }, isRequired: true, label: { en: 'Artist' } },
      { name: 'tracks', type: { name: 'text' }, isRequired: true, label: { en: 'Track list' } },
    ],
  },
];

setupProductTypes().catch((err) => console.log(err));

async function setupProductTypes() {
  await deleteAllProducts();
  await deleteAllProductTypes();
  for (const draft of desiredProductTypes) {
    await apiProjectClient
      .productTypes()
      .post({ body: draft })
      .execute()
      .then((response) => response.body);
  }
}

async function deleteAllProductTypes() {
  const productTypes = await apiProjectClient
    .productTypes()
    .get()
    .execute()
    .then((response) => response.body.results);
  for (const productType of productTypes) {
    await apiProjectClient
      .productTypes()
      .withId({ ID: productType.id })
      .delete({ queryArgs: { version: productType.version } })
      .execute();
  }
}
