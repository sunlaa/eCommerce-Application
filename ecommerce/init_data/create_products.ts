import { apiProjectClient } from './admin_client';
import { deleteAllProducts } from './common';
import {
  ProductDraft,
  CategoryResourceIdentifier,
  ProductTypeResourceIdentifier,
  ProductVariantDraft,
} from '@commercetools/platform-sdk';
import { Image } from '@commercetools/platform-sdk';
import csv from 'csvtojson';

const csvFilePath = './init_data/data_products.csv';

type ProductData = {
  album_title: string;
  band_name: string;
  year: string;
  genre: string;
  price: string;
  description: string;
  tracks: string;
};

setupProducts().catch((err) => console.log(err));

async function setupProducts() {
  await deleteAllProducts();

  const products = (await csv().fromFile(csvFilePath)) as ProductData[];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productName = product.album_title;
    const productDecription = product.description;
    const productUniqueKey = `${product.band_name}-${product.album_title}-${product.year}`
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    const productUniqueKeyRed = `${productUniqueKey}-red`;
    const productUniqueKeyBlue = `${productUniqueKey}-blue`;
    const sku = `${product.album_title} - ${product.band_name}`;
    const skuRed = `${sku} (RED)`;
    const skuBlue = `${sku} (BLUE)`;

    const categories: CategoryResourceIdentifier[] = [{ key: product.genre, typeId: 'category' }];
    const productType: ProductTypeResourceIdentifier = { typeId: 'product-type', key: 'vinyl' };

    const artistPath = product.band_name.replace(/[^a-zA-Z0-9]/g, '_').toLocaleLowerCase();
    const albumTitlePath = product.album_title.replace(/[^a-zA-Z0-9]/g, '_').toLocaleLowerCase();
    const imagePathMain = `https://raw.githubusercontent.com/sunlaa/commerce-images/main/vinyl_records/${product.genre}/${artistPath}/${albumTitlePath}/main.jpg`;
    const productImages: Image[] = [{ url: imagePathMain, dimensions: { w: 500, h: 500 }, label: 'Main' }];
    const productCommonAttributes = [
      { name: 'year', value: parseInt(product.year) },
      { name: 'artist', value: product.band_name },
      { name: 'tracks', value: product.tracks },
    ];

    const variantRed: ProductVariantDraft = {
      sku: skuRed,
      key: productUniqueKeyRed,
      attributes: [
        ...productCommonAttributes,
        { name: 'color', value: 'red' },
        { name: 'price', value: { centAmount: ((parseFloat(product.price) + 5) * 100) | 0, currencyCode: 'EUR' } },
      ],
      images: productImages,
    };
    const variantBlue: ProductVariantDraft = {
      sku: skuBlue,
      key: productUniqueKeyBlue,
      attributes: [
        ...productCommonAttributes,
        { name: 'color', value: 'blue' },
        { name: 'price', value: { centAmount: ((parseFloat(product.price) + 2) * 100) | 0, currencyCode: 'EUR' } },
      ],
      images: productImages,
    };
    const variantBlack: ProductVariantDraft = {
      sku: sku,
      key: productUniqueKey,
      attributes: [
        ...productCommonAttributes,
        { name: 'color', value: 'black' },
        { name: 'price', value: { centAmount: (parseFloat(product.price) * 100) | 0, currencyCode: 'EUR' } },
      ],
      images: productImages,
    };

    const variants: ProductVariantDraft[] = [];
    switch (i % 3) {
      case 0:
        variants.push(variantRed, variantBlue);
        break;
      case 1:
        variants.push(variantRed);
        break;
    }

    const productDraft: ProductDraft = {
      key: productUniqueKey,
      name: { en: productName },
      slug: { en: productUniqueKey },
      description: { en: productDecription },
      productType: productType,
      categories: categories,
      masterVariant: variantBlack,
      variants: variants,
    };
    await apiProjectClient
      .products()
      .post({ body: productDraft })
      .execute()
      .then((response) => response.body);
  }
}
