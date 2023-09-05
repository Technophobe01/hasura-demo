/*
 *  Custom JavaScript Functions
 *     Date: August 22, 2023
 *   Author: Matt Kryshak
 *  Version: 2.0
 *
 */

const endpoint = 'https://hasura.igraphql.co/v1/graphql';
const query = `
  query FetchTableData {
    getSkus {
      sku_id
      assets(tag: "thumbnail") {
        url
      }
      description {
        brand
        name
        type
      }
      inventory {
        quantity
      }
      price {
        retail
        sale
      }
    }
  }
`;

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
    const result = await postData(endpoint, JSON.stringify({ query: query }));
    
    if (Object.prototype.hasOwnProperty.call(result, 'data')) {
        result.data.getSkus.forEach(function(sku) {
            let row = {
                sku: sku.sku_id,
                quantity: 0
            };
            
            if (Object.prototype.hasOwnProperty.call(sku, 'assets')) {
                sku.assets.forEach(function(asset) {
                    row.thumbnail = asset.url;
                });
            }
            
            if (Object.prototype.hasOwnProperty.call(sku, 'description')) {
                row.brand = sku.description.brand;
                row.name = sku.description.name;
                row.type = sku.description.type;
            }
            
            if (Object.prototype.hasOwnProperty.call(sku, 'inventory')) {
                sku.inventory.forEach(function(store) {
                    row.quantity += store.quantity;
                });
            }
            
            if (Object.prototype.hasOwnProperty.call(sku, 'price')) {
                row.retail = sku.price.retail;
                row.sale = sku.price.sale ? sku.price.sale : '';
            }
            
            displayRow(row);
        });
    }
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
