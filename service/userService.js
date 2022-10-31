const connection = require('../model/connection');
const fs = require('fs');
const qs = require('qs');
const productService = require("./productService");
connection.connecting();
let idUser = null;

class UserService {

    login(user, res) {
        connection.connection.query(`SELECT *
                                     FROM users`, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                if (user.name === 'admin' && user.password === 'admin') {
                    res.writeHead(301, {'location': '/admin'});
                    res.end();
                } else {
                    let check = false;
                    for (let i = 0; i < results.length; i++) {
                        if (user.name === results[i].name && user.password === results[i].password) {
                            check = true;
                            idUser = results[i].id;
                            res.writeHead(301, {'location': '/user'});
                            res.end();
                        }
                    }
                    if (!check) {
                        fs.readFile('./views/user/login.html', "utf-8", (err, loginHtml) => {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            loginHtml = loginHtml.replace('{notification}', `<p style="text-align: center; background-color: white">Tài khoản hoặc Mật khẩu không đúng<br>Hãy nhập lại</p>`);
                            res.write(loginHtml);
                            res.end();
                        });
                    }
                }
            }
        });
    }

    getIdUser() {
        return idUser;
    }

    register(newUser, res) {
        connection.connection.query(`SELECT *
                                     FROM users`, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                let check = false;
                for (let i = 0; i < results.length; i++) {
                    if (newUser.name === results[i].name) {
                        check = true;
                        fs.readFile('./views/user/register.html', "utf-8", (err, registerHtml) => {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            registerHtml = registerHtml.replace('{notification}', `<p style="text-align: center; background-color: white">Tài khoản đã tồn tại<br>Hãy nhập lại</p>`);
                            res.write(registerHtml);
                            res.end();
                        });
                    }
                }
                if (!check) {
                    connection.connection.query(`INSERT INTO users(name, password)
                                                 values ("${newUser.name}",
                                                         "${newUser.password}")`, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Insert Data Success');
                            res.writeHead(301, {'location': '/login'});
                            res.end();
                        }
                    });
                }
            }
        });
    }

    findProductById(idP) {
        return new Promise((resolve, reject) => {
            connection.connection.query(`select products.id, products.name, price
                                         from orderdetail
                                                  join products on idProduct = products.id
                                         where idProduct = ${idP}
                                         group by id`, (err, product) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(product);
                }
            });
        })
    }

    deleteProduct(id) {
        return new Promise((resolve, reject) => {
            connection.connection.query(` delete
                                          from orderdetail
                                          where idProduct = ${id}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Delete Success !!!');
                    resolve(products);
                }
            });
        })
    }

    getTotalPrice(idO) {
        return new Promise((resolve, reject) => {
            const sql = `select SUM(orderdetail.quantity * price) as total
                         from orderdetail
                                  join products p on p.id = orderdetail.idProduct
                         where idOrder = "${idO}"`
            connection.connection.query(sql, (err, total) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(total);
                }
            });
        })

    }

    buyProduct(idO) {
        return new Promise((resolve, reject) => {
            connection.connection.query(`update orders
                                         set status = true
                                         where id = ${idO}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Buy Success !!!');
                    resolve(products);
                }
            });
        })
    }

    deleteCart(idO) {
        return new Promise((resolve, reject) => {
            connection.connection.query(` delete
                                          from orderdetail
                                          where idOrder = ${idO};
            delete
            from orders
            where id = ${idO}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Delete Success !!!');
                    resolve(products);
                }
            });
        })
    }

}

new UserService().getIdUser()

module.exports = new UserService();