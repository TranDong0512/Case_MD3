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
            connection.connection.query(`insert into products(name, price, quantity, IMG, idcategory)
                                         values ("${product.name}", "${+product.price}", "${+product.quantity}",
                                                 "${product.IMG}",
                                                 "${+product.idcategory}");`, function (err, product) {
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

    quantityAfterBuy(quantity, id) {
        return new Promise((resolve, reject) => {
            connection.connection.query(`update products
                                         set quantity = '${quantity}'
                                         where id = ${id}`, (err, quantity) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Edit Success !!!');
                    resolve(quantity);
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
            connection.connection.query(`select *
                                         from products
                                         where name = '${nameP}'`, (err, products) => {
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
            connection.connection.query(`select *
                                         from products
                                         where price between ${price1} and ${price2}`, (err, products) => {
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
            connection.connection.query(`select *
                                         from products
                                         where idCategory = ${idC}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Find Success !!!');
                    resolve(products);
                }
            });
        })
    }

    createOrder(idUser) {
        const sql = `INSERT INTO orders(idUser, status)
                     values ("${idUser}", false)`;
        connection.connection.query(sql, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Insert Data Success !!!');
            }
        })
    }

    //Người dùng đang đăng nhập đã có hóa đơn chưa?
    checkOrder(idU) {
        return new Promise((resolve, reject) => {
            const sql = `select *
                         from orders
                         where idUser = ${idU}
                           and status = false`  //Status = false : chưa thanh toán
            connection.connection.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                }
                if (results.length === 0) {
                    resolve(false) // false : Người dùng không có hóa đơn chưa thanh toán
                } else {
                    resolve(true);
                }
            })
        })
    }

    getIdOrder(idU) {
        return new Promise((resolve, reject) => {
            const sql = `select *
                         from orders
                         where idUser = ${idU}
                           and status = false`
            connection.connection.query(sql, (err, results) => {
                if (err) {
                    reject(err)
                }
                resolve(results[0].id)
            })
        })
    }

    getQuantityP(id) {
        return new Promise((resolve, reject) => {
            const sql = `select products.quantity
                         from products
                         where id = ${id}`
            connection.connection.query(sql, (err, results) => {
                if (err) {
                    reject(err)
                }
                resolve(results[0])
            })
        })
    }

    //Thêm sản phẩm vào hóa đơn(oD)
    addProductToOrderDetail(quantity, idO, idP) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO orderdetail(quantity, idOrder, idProduct)
                         values ("${quantity}", "${idO}", ${idP})`;
            connection.connection.query(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Insert Data Success');
                    resolve('Đã thêm vào orderDetail');
                }
            })
        })
    }

    getProductsFromOrderD(idO) {
        return new Promise((resolve, reject) => {
            const sql = `select SUM(orderdetail.quantity) as quantity, products.id, products.name, price
                         from orderdetail
                                  join products on idProduct = products.id
                                  join orders o on o.id = orderdetail.idOrder
                         where idOrder = "${idO}"
                         group by id`
            connection.connection.query(sql, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            });
        })
    }

    getOrders() {
        return new Promise((resolve, reject) => {
            connection.connection.query('select * from orders join users u on u.id = orders.idUser', (err, orders) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(orders);
                }
            });
        })
    }

    deleteOrder(idO) {
        return new Promise((resolve, reject) => {
            connection.connection.query(` delete
                                          from orderdetail
                                          where idOrder = ${idO}`);
            connection.connection.query(`
                delete
                from orders
                where id = ${idO}`, (err, orders) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Delete Success !!!');
                    resolve(orders);
                }
            });
        })
    }
}

module.exports = new ProductService();