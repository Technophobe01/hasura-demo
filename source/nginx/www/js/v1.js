/*
 *  Custom JavaScript Functions
 *     Date: August 22, 2023
 *   Author: Matt Kryshak
 *  Version: 2.0
 *
 */

const basePath = 'https://inventory-api.igraphql.co/api/v1';

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
    const skus = await getSkus();
    
    if (Array.isArray(skus)) {
        skus.forEach(async function(skuId) {
            await Promise.all([
                getAssets(skuId),
                getDescription(skuId),
                getInventory(skuId),
                getPrice(skuId)
            ]).then(function(results) {
                let row = {
                    sku: skuId,
                    quantity: 0
                };
                
                const [assets, description, inventory, price] = results;
                
                if (Array.isArray(assets)) {
                    assets.forEach(function(asset) {
                        if (asset.tag === 'thumbnail') {
                            row.thumbnail = asset.url;
                        }
                    });
                }
                
                if (Object.keys(description).length > 0) {
                    if (Object.prototype.hasOwnProperty.call(description, 'brand')) {
                        row.brand = description.brand;
                    }
                    
                    if (Object.prototype.hasOwnProperty.call(description, 'name')) {
                        row.name = description.name;
                    }
                    
                    if (Object.prototype.hasOwnProperty.call(description, 'type')) {
                        row.type = description.type;
                    }
                }
                
                if (Array.isArray(inventory)) {
                    inventory.forEach(function(store) {
                        row.quantity += store.quantity;
                    });
                }
                
                if (Object.keys(price).length > 0) {
                    if (Object.prototype.hasOwnProperty.call(price, 'retail')) {
                        row.retail = price.retail;
                    }
                    
                    if (Object.prototype.hasOwnProperty.call(price, 'sale')) {
                        row.sale = price.sale ? price.sale : '';
                    }
                }
                
                displayRow(row);
            });
        });
    }
};

const getAssets = function(skuId) {
    return new Promise(function(resolve) {
        $.get(`${basePath}/skus/${skuId}/assets`).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            resolve();
        });
    });
};

const getDescription = function(skuId) {
    return new Promise(function(resolve) {
        $.get(`${basePath}/skus/${skuId}/description`).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            resolve();
        });
    });
};

const getInventory = function(skuId) {
    return new Promise(function(resolve) {
        $.get(`${basePath}/skus/${skuId}/inventory`).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            resolve();
        });
    });
};

const getPrice = function(skuId) {
    return new Promise(function(resolve) {
        $.get(`${basePath}/skus/${skuId}/price`).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            resolve();
        });
    });
};

const getSkus = function() {
    return new Promise(function(resolve) {
        $.get(`${basePath}/skus`).done(function(data) {
            resolve(data);
        }).fail(function(error) {
            resolve();
        });
    });
};

$(document).ready(function() {
    fetchTableData();
});
