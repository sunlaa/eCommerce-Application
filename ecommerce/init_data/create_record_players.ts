import { apiProjectClient } from './admin_client';
import { deleteAllProducts } from './common';
import {
  ProductDraft,
  CategoryResourceIdentifier,
  ProductTypeResourceIdentifier,
  ProductVariantDraft,
} from '@commercetools/platform-sdk';
import csv from 'csvtojson';

const csvFilePath = './init_data/data_record_players.csv';

type ProductData = {
  model: string;
  brand_name: string;
  year: string;
  price: string;
  description: string;
};

setupProducts().catch((err) => console.log(err));

async function setupProducts() {
  await deleteAllProducts('record-players');

  const products = (await csv().fromFile(csvFilePath)) as ProductData[];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productName = `${product.brand_name} ${product.model}`;
    const productDecription = product.description;
    const productUniqueKey = `${product.brand_name}-${product.model}-${product.year}`
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    const categories: CategoryResourceIdentifier[] = [{ typeId: 'category', key: 'record-players' }];
    const productType: ProductTypeResourceIdentifier = { typeId: 'product-type', key: 'record-players' };

    const brandPath = product.brand_name.replace(/[^a-zA-Z0-9]/g, '_').toLocaleLowerCase();
    const modelPath = product.model.replace(/[^a-zA-Z0-9]/g, '_').toLocaleLowerCase();

    const imagePathDir = `https://raw.githubusercontent.com/sunlaa/commerce-images/main/record_players/${brandPath}/${modelPath}`;
    const productImages = [
      { url: `${imagePathDir}/main.jpg`, dimensions: { w: 500, h: 500 }, label: 'Main' },
      { url: `${imagePathDir}/1.jpg`, dimensions: { w: 500, h: 500 }, label: '1' },
      { url: `${imagePathDir}/2.jpg`, dimensions: { w: 500, h: 500 }, label: '2' },
    ];
    const productCommonAttributes = [
      { name: 'year', value: parseInt(product.year) },
      { name: 'brand', value: product.brand_name },
    ];
    const masterVariant: ProductVariantDraft = {
      sku: productUniqueKey,
      key: productUniqueKey,
      attributes: productCommonAttributes,
      images: productImages,
      prices: [{ value: { centAmount: (parseFloat(product.price) * 100) | 0, currencyCode: 'EUR' } }],
    };
    const productDraft: ProductDraft = {
      key: productUniqueKey,
      name: { en: productName },
      slug: { en: productUniqueKey },
      description: { en: productDecription },
      productType: productType,
      categories: categories,
      masterVariant: masterVariant,
      taxCategory: { key: 'standard-vat', typeId: 'tax-category' },
    };
    await apiProjectClient
      .products()
      .post({ body: productDraft })
      .execute()
      .then((response) => response.body);
  }
}
