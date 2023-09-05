/*
 *  Custom JavaScript Functions
 *     Date: August 22, 2023
 *   Author: Matt Kryshak
 *  Version: 2.0
 *
 */

const endpoint = 'https://hasura.igraphql.co/v1/graphql';

const displayRow = function(row) {
    const html = '<tr>\n' +
        `  <td class="column0">${row.sku}</td>\n` +
        `  <td class="column1">${row.name}</td>\n` +
        `  <td class="column2">${row.brand}</td>\n` +
        `  <td class="column3">${row.type}</td>\n` +
        `  <td class="column4">${row.quantity}</td>\n` +
        `  <td class="column5">${row.retail}</td>\n` +
        `  <td class="column6">${row.sale}</td>\n` +
        `  <td class="column8"><img src="${row.thumbnail}" height="40"></td>\n` +
        '<tr>';
    
    $("#table tbody").append(html);
    $("#table tbody tr:last").remove();
};

const fetchTableData = async function() {
    const skus = await postData(endpoint, JSON.stringify({ query: getSkus() }));
    
    if (Object.prototype.hasOwnProperty.call(skus, 'data')) {
        skus.data.getSkus.forEach(async function(sku) {
            await Promise.all([
                postData(endpoint, JSON.stringify({ query: getAssets(sku.sku_id) })),
                postData(endpoint, JSON.stringify({ query: getDescription(sku.sku_id) })),
                postData(endpoint, JSON.stringify({ query: getInventory(sku.sku_id) })),
                postData(endpoint, JSON.stringify({ query: getPrice(sku.sku_id) }))
            ]).then(function(results) {
                const [assets, description, inventory, price] = results;
                
                let row = {
                    sku: sku.sku_id,
                    quantity: 0
                };
                
                if (Object.prototype.hasOwnProperty.call(assets, 'data')) {
                    assets.data.getAssets.forEach(function(asset) {
                        row.thumbnail = asset.url;
                    });
                }
                
                if (Object.prototype.hasOwnProperty.call(description, 'data')) {
                    row.brand = description.data.getDescription.brand;
                    row.name = description.data.getDescription.name;
                    row.type = description.data.getDescription.type;
                }
                
                if (Object.prototype.hasOwnProperty.call(inventory, 'data')) {
                    inventory.data.getInventory.forEach(function(store) {
                        row.quantity += store.quantity;
                    });
                }
                
                if (Object.prototype.hasOwnProperty.call(price, 'data')) {
                    row.retail = price.data.getPrice.retail;
                    row.sale = price.data.getPrice.sale ? price.data.getPrice.sale : '';
                }
                
                displayRow(row);
            });
        });
    }
};

const getAssets = function(skuId) {
    return `
        query getAssets {
          getAssets(sku_id: ${skuId}, tag: "thumbnail") {
            url
          }
        }
    `;
};

const getDescription = function(skuId) {
    return `
        query getDescription {
          getDescription(sku_id: ${skuId}) {
            brand
            name
            type
          }
        }
    `;
};

const getInventory = function(skuId) {
    return `
        query getInventory {
          getInventory(sku_id: ${skuId}) {
            quantity
          }
        }
    `;
};

const getPrice = function(skuId) {
    return `
        query getPrice {
          getPrice(sku_id: ${skuId}) {
            retail
            sale
          }
        }
    `;
};

const getSkus = function() {
    return `
        query getSkus {
          getSkus {
            sku_id
          }
        }
    `;
};

const postData = function(url, data) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: url,
            method: 'POST',
            data: data,
            contentType: 'application/json'
        }).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            reject(error);
        });
    });
};

$(document).ready(function() {
    fetchTableData();
});
