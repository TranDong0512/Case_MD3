const userService = require('../../service/userService')
const fs = require("fs");
const qs = require("qs");
const connection = require("../../model/connection");
const productService = require("../../service/productService");

class UserRouting {
    login(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/login.html', "utf-8", (err, loginHtml) => {
                if (err) {
                    console.log(err.message);
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                loginHtml = loginHtml.replace('{notification}', '');
                res.write(loginHtml);
                res.end();
            });
        } else {
            let dataLogin = '';
            req.on('data', chunk => {
                dataLogin += chunk;
            });
            req.on('end', async () => {
                const user = qs.parse(dataLogin);
                await userService.login(user, res);
            });
        }
    }

    register(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/register.html', "utf-8", (err, registerHtml) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                registerHtml = registerHtml.replace('{notification}', '');
                res.write(registerHtml);
                res.end();
            });
        } else {
            let dataRegister = '';
            req.on('data', chunk => {
                dataRegister += chunk;
            });
            req.on('end', () => {
                const newUser = qs.parse(dataRegister);
                userService.register(newUser, res);
            });
        }
    }

    admin(req, res) {
        fs.readFile('./views/menu/admin.html', "utf-8", (err, adminHtml) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(adminHtml);
            res.end();
        });
    }

    user(req, res) {
        let html = '';
        fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.getProducts();
                products.forEach((value, index1) => {
                    html += '<tr>';
                    html += `<td>${index1 + 1}</td>`
                    html += `<td>${value.name}</td>`
                    html += `<td>${value.price}</td>`
                    html += `<td>${value.quantity}</td>`
                    html += `<td><a><button type="submit">Thêm</button></a></td>`
                    html += '</tr>';
                })
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            userHtml = userHtml.replace('{products}', html);
            res.write(userHtml);
            res.end();
        });
    }
}

module.exports = new UserRouting();