const connection = require('../model/connection');
const fs = require('fs');
const qs = require('qs');
connection.connecting();

class UserService {

    login(user, res) {
        connection.connection.query(`SELECT *FROM users`, function (err, results) {
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
                            console.log("user");
                        }
                    }
                    if (!check) {
                        fs.readFile('./views/user/login.html', "utf-8", (err, loginHtml) => {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            loginHtml = loginHtml.replace('{notification}', `<p>Tài khoản hoặc Mật khẩu không đúng<br>Hãy nhập lại</p>`);
                            res.write(loginHtml);
                            res.end();
                        });
                    }
                }
            }
        });
    }

    register(newUser, res) {
        connection.connection.query(`SELECT *FROM users`, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                let check = false;
                for (let i = 0; i < results.length; i++) {
                    if (newUser.name === results[i].name) {
                        check = true;
                        fs.readFile('./views/user/register.html', "utf-8", (err, registerHtml) => {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            registerHtml = registerHtml.replace('{notification}', `<p>Tài khoản đã tồn tại<br>Hãy nhập lại</p>`);
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
}

module.exports = new UserService();