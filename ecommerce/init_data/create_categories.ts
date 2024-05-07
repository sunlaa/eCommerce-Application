import { apiProjectClient } from './_admin_client';
import { CategoryDraft } from '@commercetools/platform-sdk';
import dataCategoriesJson from './data_categories.json';

const desiredCategories: Record<string, string[]> = dataCategoriesJson;

setupCategories()


async function setupCategories() {
    await deleteAllCategories();

    for (const key in desiredCategories) {
        const categoryParentDraft: CategoryDraft = {
            name: { en: key },
            description: { en: key },
            key: key,
            slug: {en: `slug-${key}`}
        };
        const categoryParent = await apiProjectClient.categories().post({ body: categoryParentDraft }).execute().then(response => response.body)

        for (const subcategoryKey of desiredCategories[key]) {
            // correct key for band / artist
            const validKeyId = subcategoryKey.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

            const categoryChildDraft: CategoryDraft = {
                name: { en: subcategoryKey },
                description: { en: subcategoryKey },
                key: validKeyId,
                slug: {en: `slug-${validKeyId}`},
                parent: { id: categoryParent.id, typeId: 'category' }
            };

            await apiProjectClient.categories().post({ body: categoryChildDraft }).execute().then(response => response.body)
        }
    }
}

async function deleteAllCategories() {
    const categories = await apiProjectClient.categories().get().execute().then(response => response.body.results);
    for (const category of categories) {
        await apiProjectClient.categories().withId({ ID: category.id })
            .delete(
                { queryArgs: { version: category.version } }
            )
            .execute();
    }
}
