const productService = require('../../service/productService')
const fs = require("fs");
const qs = require("qs");
const connection = require("../../model/connection");
const userRouting = require('../handler/userRouting');

class ProductRouting {
    showAllProduct(req, res) {
        let html = '';
        fs.readFile('./views/product/show.html', "utf-8", async (err, showHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.getProducts();
                products.forEach((value, index) => {
                    html += '<tr>';
                    html += `<td>${index + 1}</td>`
                    html += `<td>${value.name}</td>`
                    html += `<td>${value.price}</td>`
                    html += `<td>${value.quantity}</td>`
                    html += `<td><a href="/admin/deleteProduct/${value.id}" ><button type="submit">Delete</button></a></td>`
                    html += `<td><a href="/admin/editProduct/${value.id}"><button type="submit">Edit</button></a></td>`
                    html += '</tr>';
                })
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            showHtml = showHtml.replace('{products}', html);
            res.write(showHtml);
            res.end();
        });
    }

    showAddProduct(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/product/add.html', "utf-8", (err, addHtml) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(addHtml);
                res.end();
            });
        }

        if (req.method === 'POST') {
            let dataProduct = '';
            req.on('data', chunk => {
                dataProduct += chunk;
            });
            req.on('end', async () => {
                const newProduct = qs.parse(dataProduct);
                await productService.add(newProduct);
                res.writeHead(301, {'location': '/admin'});
                res.end();
            });
        }
    }

    showEditProduct(req, res, id) {
        if (req.method === "GET") {
            fs.readFile('./views/product/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err);
                } else {
                    let product = await productService.findById(id);
                    editHtml = editHtml.replace('{name}', product[0].name);
                    editHtml = editHtml.replace('{price}', product[0].price);
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            });
        } else {
            let productEdit = '';
            req.on('data', chunk => {
                productEdit += chunk
            });
            req.on('end', async (err) => {
                if (err) {
                    console.log(err);
                } else {
                    let product = qs.parse(productEdit);
                    await productService.edit(product, id);
                    res.writeHead(301, {'location': '/admin/showAllProduct'});
                    res.end();
                }
            });
        }
    }

    showDeleteProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/product/delete.html', "utf-8", async (err, deleteHtml) => {
                let product = await productService.findById(id);
                deleteHtml = deleteHtml.replace('{name}', product[0].name);
                deleteHtml = deleteHtml.replace('{price}', product[0].price);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(deleteHtml);
                res.end();
            });
        } else {
            productService.delete(id).then(r => {
                res.writeHead(301, {'location': '/admin/showAllProduct'});
                res.end();
            });

        }
    }

    //Hiện thị sản phẩm theo tên
    showFindProductByName(req, res) {
        if (req.method === 'POST') {
            let nameProduct = '';
            req.on('data', chunk => {
                nameProduct += chunk;
            });
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let nameP = qs.parse(nameProduct);
                    let html = '';
                    fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
                        if (err) {
                            console.log(err);
                        } else {
                            let products = await productService.findProductByName(nameP.name);
                            products.forEach((value, index2) => {
                                html += '<tr>';
                                html += `<td>${index2 + 1}</td>`
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
            })
        }
    }

    //Hiện thị sản phẩm theo giá
    showFindProductByPrice(req, res) {
        if (req.method === 'POST') {
            let priceProduct = '';
            req.on('data', chunk => {
                priceProduct += chunk;
                console.log(priceProduct);
            });
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let priceP = qs.parse(priceProduct);
                    console.log(priceP)
                    let html = '';
                    fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
                        if (err) {
                            console.log(err);
                        } else {
                            let products = await productService.findProductByPrice(priceP.price1, priceP.price2);
                            products.forEach((value, index3) => {
                                html += '<tr>';
                                html += `<td>${index3 + 1}</td>`
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
            })
        }
    }

    //Hiện thị danh sách Loại
    showFindProductByCategory(req, res) {
        let html = '';
        fs.readFile('./views/product/category.html', "utf-8", async (err, category) => {
            if (err) {
                console.log(err)
            } else {
                let category = await productService.getCategory();
                category.forEach((value, index) => {
                    html += '<tr>';
                    html += `<td>${index + 1}</td>`
                    html += `<td>${value.name}</td>`
                    html += `<td><a href="/user/resultFindProductByCategory/${value.id}" ><button type="submit">Search</button></a></td>`
                    html += '</tr>';
                })
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            category = category.replace('{category}', html);
            res.write(category);
            res.end();
        })
    }

    //Hiện thị kết quả tìm kiếm theo Loại
    showResultFindProductByCategory(req, res, id) {
        let html = '';
        fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.findProductByCategory(id);
                products.forEach((value, index4) => {
                    html += '<tr>';
                    html += `<td>${index4 + 1}</td>`
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

module.exports = new ProductRouting();