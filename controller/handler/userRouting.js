const userService = require('../../service/userService')
const fs = require("fs");
const qs = require("qs");
const connection = require("../../model/connection");
const productService = require("../../service/productService");
const categoryService = require("../../service/userService")

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

}

module.exports = new UserRouting();