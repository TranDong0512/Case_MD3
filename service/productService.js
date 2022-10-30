const connection = require('../model/connection');
const fs = require('fs');
const qs = require('qs');

class ProductService {

    getCategory() {
        return new Promise((resolve, reject) => {
            connection.connection.query('select * from category', (err, category) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(category);
                }
            });
        })
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            connection.connection.query('select * from products', (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            });
        })
    }

    add(product) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO products(name, price, quantity,IMG)
                         values ("${product.name}", ${product.price}, ${product.quantity}, "${product.img}")`;
            connection.connection.query(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    console.log('Insert Data Success');
                    resolve(product);
                }
            })
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            connection.connection.query(`select *
                                         from products
                                         where id = ${id}`, (err, product) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(product);
                }
            });
        })
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            connection.connection.query(` delete
                                          from products
                                          where id = ${id}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Delete Success !!!');
                    resolve(products);
                }
            });
        })
    }

    edit(product, id) {
        return new Promise((resolve, reject) => {
            connection.connection.query(`update products
                                         set name  = '${product.name}',
                                             price = ${product.price}
                                         where id = ${id}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Edit Success !!!');
                    resolve(products);
                }
            });
        })
    }

    findProductByName(nameP) {
        return new Promise((resolve, reject) => {
            connection.connection.query(`select * from products where name = '${nameP}'`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Find Success !!!');
                    resolve(products);
                }
            });
        })
    }

    findProductByPrice(price1, price2) {
        return new Promise((resolve, reject) => {
            connection.connection.query(`select * from products where price between ${price1} and ${price2}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Find Success !!!');
                    resolve(products);
                }
            });
        })
    }

    findProductByCategory(idC) {
        return new Promise((resolve, reject) => {
            connection.connection.query(`select * from products where idCategory = ${idC}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Find Success !!!');
                    resolve(products);
                }
            });
        })
    }
}

module.exports = new ProductService();