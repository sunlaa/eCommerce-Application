import { apiProjectClient } from './admin_client';
import { ProductTypeDraft } from '@commercetools/platform-sdk';

const desiredProductTypes: ProductTypeDraft[] = [
  {
    key: 'record-players',
    name: 'Record players',
    description: 'Record players for playing your favorite music',
    attributes: [
      { name: 'year', type: { name: 'number' }, isRequired: true, label: { en: 'Year' } },
      { name: 'brand', type: { name: 'text' }, isRequired: true, label: { en: 'Brand' } },
    ],
  },
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
  for (const draft of desiredProductTypes) {
    await apiProjectClient
      .productTypes()
      .post({ body: draft })
      .execute()
      .then((response) => response.body);
  }
}
