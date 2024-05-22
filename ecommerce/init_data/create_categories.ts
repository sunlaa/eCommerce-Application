import { apiProjectClient } from './admin_client';
import { CategoryDraft } from '@commercetools/platform-sdk';
import dataCategoriesJson from './data_categories.json';

interface DataCategories {
  [key: string]: string[];
}

const desiredCategories: Record<string, string[]> = dataCategoriesJson as DataCategories;

setupCategories().catch((err) => console.log(err));

async function setupCategories() {
  await deleteAllCategories();

  for (const key in desiredCategories) {
    const validKey = key.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const categoryParentDraft: CategoryDraft = {
      name: { en: key },
      description: { en: key },
      key: validKey,
      slug: { en: `slug-${validKey}` },
    };
    const categoryParent = await apiProjectClient
      .categories()
      .post({ body: categoryParentDraft })
      .execute()
      .then((response) => response.body);

    for (const subcategoryKey of desiredCategories[key]) {
      // correct key for sub categories
      const validKeyId = subcategoryKey.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

      const categoryChildDraft: CategoryDraft = {
        name: { en: subcategoryKey },
        description: { en: subcategoryKey },
        key: validKeyId,
        slug: { en: `slug-${validKeyId}` },
        parent: { id: categoryParent.id, typeId: 'category' },
      };

      await apiProjectClient
        .categories()
        .post({ body: categoryChildDraft })
        .execute()
        .then((response) => response.body);
    }
  }
}

async function deleteAllCategories() {
  const categories = await apiProjectClient
    .categories()
    .get()
    .execute()
    .then((response) => response.body.results);
  for (const category of categories) {
    await apiProjectClient
      .categories()
      .withId({ ID: category.id })
      .delete({ queryArgs: { version: category.version } })
      .execute();
  }
}
