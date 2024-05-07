import { apiProjectClient } from './_admin_client';
import { ProductDraft, CategoryResourceIdentifier, ProductTypeResourceIdentifier } from '@commercetools/platform-sdk';
import csv from 'csvtojson';
import fs from 'fs';


const csvFilePath = './init_data/data_products.csv';
const folderWithCovers = './init_data/covers';

type ProductData = {
    id: string
    album_title: string
    band_name: string
    year: string
    genre: string
    price: string
}

setupProducts()

async function setupProducts() {

    await deleteAllProducts();

    const products = await csv().fromFile(csvFilePath) as ProductData[];

    // need as workaround to get last id to get cover image
    let lastId = 0;
    let numAfterLastId = 0;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const productUniqueKey = `${product.band_name}-${product.album_title}-${product.year}`.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

        const categories: CategoryResourceIdentifier[] = [
            {key: product.genre, typeId: "category"},
            {key: product.band_name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(), typeId: "category"},
        ]
        const productType: ProductTypeResourceIdentifier = {typeId: "product-type", key: "vinyl"};

        const productDraft: ProductDraft = {
            key: productUniqueKey,
            name: {en: product.album_title },
            slug: {en: productUniqueKey},
            description: {en: product.album_title},
            productType: productType,
            categories: categories,
            masterVariant: {
                sku: product.album_title,
                key: productUniqueKey,
                attributes: [
                    {name: "year", value: parseInt(product.year)},
                    {name: "price", value: { centAmount: parseInt(product.price) * 100, currencyCode: "USD"}},
                    {name: "color", value: 'black'},
                ]
            },
            variants: [
                {sku: product.album_title + ' (RED)', key: productUniqueKey+'-red', attributes: [
                    {name: "color", value: 'red'}, 
                    {name: "year", value: parseInt(product.year)},
                    {name: "price", value: { centAmount: parseInt(product.price) * 100, currencyCode: "USD"}},
                ]},
                {sku: product.album_title + ' (BLUE)', key: productUniqueKey+'-blue', attributes: [
                    {name: "color", value: 'blue'}, 
                    {name: "year", value: parseInt(product.year)},
                    {name: "price", value: { centAmount: parseInt(product.price) * 100, currencyCode: "USD"}},
                ]}
            ]
        }
        // upload product info
        const createdProduct = await apiProjectClient.products().post({ body: productDraft }).execute().then(response => response.body);
        
        // upload and attach image from covers folder
        lastId = parseInt(product.id) || lastId;
        numAfterLastId = product.id ? 1 : numAfterLastId + 1;
        const partLastId = lastId < 10 ? `0${lastId}` : `${lastId}`;
        const partNumAfterLastId = numAfterLastId < 10 ? `0${numAfterLastId}` : `${numAfterLastId}`;
        const imageFileBuffer = fs.readFileSync(`${folderWithCovers}/${product.genre}-${partLastId}-${partNumAfterLastId}.jpg`);
        for (let variant = 1; variant < 4; variant++) {
            await apiProjectClient.products().withId({ ID: createdProduct.id })
                .images().post({ body: imageFileBuffer, headers: { 'Content-Type': 'image/jpeg' }, queryArgs: { variant: variant}})
                .execute();
        }
    }
}

async function deleteAllProducts() {
    const products = await apiProjectClient.products().get().execute().then(response => response.body.results);
    for (const product of products) {
        await apiProjectClient.products().withId({ ID: product.id })
            .delete(
                { queryArgs: { version: product.version } }
            )
            .execute();
    }
}