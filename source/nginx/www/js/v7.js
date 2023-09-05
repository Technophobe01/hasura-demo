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
    review {
      author
      score
      summary
      sku {
        sku_id
        description {
          brand
          name
        }
        rating {
          score
        }
      }
    }
  }
`;

const displayRow = function(row) {
    const html = '<tr>\n' +
        `  <td class="column0">${row.sku}</td>\n` +
        `  <td class="column1">${row.name}</td>\n` +
        `  <td class="column2">${row.brand}</td>\n` +
        `  <td class="column3">${row.rating}</td>\n` +
        `  <td class="column4">${row.author}</td>\n` +
        `  <td class="column5">${row.score}</td>\n` +
        `  <td class="column6">${row.summary}</td>\n` +
        '<tr>';
    
    $("#table tbody").append(html);
    $("#table tbody tr:last").remove();
};

const fetchTableData = async function() {
    const result = await postData(endpoint, JSON.stringify({ query: query }));
    
    if (Object.prototype.hasOwnProperty.call(result, 'data')) {
        result.data.review.forEach(function(review) {
            const row = {};
            
            if (Object.prototype.hasOwnProperty.call(review, 'author')) {
                row.author = review.author;
            }
            
            if (Object.prototype.hasOwnProperty.call(review, 'score')) {
                let html = '';
                for (let i = 0; i < 5; i++) {
                    html += i < Math.round(review.score) ?
                        '<span class="fa fa-star checked"></span>' :
                        '<span class="fa fa-star"></span>';
                }
                row.rating = html;
            }
            
            if (Object.prototype.hasOwnProperty.call(review, 'sku')) {
                if (Object.prototype.hasOwnProperty.call(review.sku, 'description')) {
                    if (Object.prototype.hasOwnProperty.call(review.sku.description, 'brand')) {
                        row.brand = review.sku.description.brand;
                    }
                    
                    if (Object.prototype.hasOwnProperty.call(review.sku.description, 'name')) {
                        row.name = review.sku.description.name;
                    }
                    
                    if (Object.prototype.hasOwnProperty.call(review.sku.description, 'type')) {
                        row.type = review.sku.description.type;
                    }
                }
                
                if (Object.prototype.hasOwnProperty.call(review.sku, 'rating')) {
                    if (Object.prototype.hasOwnProperty.call(review.sku.rating, 'score')) {
                        row.score = review.sku.rating.score;
                    }
                }
                
                if (Object.prototype.hasOwnProperty.call(review.sku, 'sku_id')) {
                    row.sku = review.sku.sku_id;
                }
            }
            
            if (Object.prototype.hasOwnProperty.call(review, 'summary')) {
                row.summary = review.summary;
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
