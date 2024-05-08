import { apiProjectClient } from './admin_client';
import { ProductTypeDraft } from '@commercetools/platform-sdk';

const desiredProductTypes: ProductTypeDraft[] = [
  {
    key: 'vinyl',
    name: 'Vinyl records',
    description: 'Vinyl records for listening to your favorite music',
    attributes: [
      { name: 'year', type: { name: 'number' }, isRequired: true, label: { en: 'Year' } },
      { name: 'price', type: { name: 'money' }, isRequired: true, label: { en: 'Price' } },
      { name: 'color', type: { name: 'text' }, isRequired: true, label: { en: 'Color' } },
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
