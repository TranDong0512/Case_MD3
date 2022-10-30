const productService = require('../../service/productService')
const fs = require("fs");
const qs = require("qs");
const connection = require("../../model/connection");
const userRouting = require('../handler/userRouting');

class ProductRouting {
    showAllProductAdmin(req, res) {
        let htmlAdmin = '';
        fs.readFile('./views/product/show.html', "utf-8", async (err, showHtml) => {
            if (err) {
                console.log(err);
            } else {
                // let products = await productService.getProducts();
                // products.forEach((value, index) => {
                //     html += '<tr>';
                //     html += `<td>${value.name}</td>`
                //     html += `<td>${value.price}</td>`
                //     html += `<td>${value.quantity}</td>`
                //     html += `<td><a href="/admin/deleteProduct/${value.id}" ><button type="submit">Delete</button></a></td>`
                //     html += `<td><a href="/admin/editProduct/${value.id}"><button type="submit">Edit</button></a></td>`
                //     html += '</tr>';
                // })
                let products = await productService.getProducts();
                htmlAdmin += `<div class="container">
                <div class="row ">`
                products.forEach((value) => {
                    htmlAdmin += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a  href="/admin/deleteProduct/${value.id}" ><button class="btn btn-primary" type="submit">Delete</button></a>
                                                    <a href="/admin/editProduct/${value.id}"><button class="btn btn-primary" type="submit">Edit</button></a>
                </div>
                </div>
                </div>`
                })
            }
            htmlAdmin += "</div></div>"
            res.writeHead(200, {'Content-Type': 'text/html'});
            showHtml = showHtml.replace('{products}', htmlAdmin);
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
                res.writeHead(301, {'location': '/admin/showAllProduct'});
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

    getCategory = async () => {
        let indexCategory = '';
        let products = await productService.getCategory();
        indexCategory += ''
        for(const value of products){
            indexCategory += `<a href="/user/resultFindProductByCategory/${value.id}" class="col-12">${value.name}</a>`
        }
        return indexCategory;
    }

    //Hiện thị sản phẩm theo tên
    showFindProductByName(req, res) {
        if (req.method === 'POST') {
            let nameProduct = '';
            req.on('data', async chunk => {
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
                            let products = await productService.findProductByName(nameP.name)
                            html += `<div class="container">
                <div class="row ">`
                            products.forEach((value) => {
                                html += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a href="/user/${value.id}"><button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button></a>
                </div>
                </div>
                </div>`
                            })
                        }
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        let category = await this.getCategory();
                        userHtml = userHtml.replace('{category}', category);
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
    userShowAll = (req, res)=> {
        let html = '';
        fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.getProducts();
                html += `<div class="container">
                <div class="row ">`
                products.forEach((value) => {
                    html += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a href="/user/${value.id}"><button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button></a>
                </div>
                </div>
                </div>`
                })
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            let category = await this.getCategory();
            userHtml = userHtml.replace('{category}', category);
            userHtml = userHtml.replace('{products}', html);
            res.write(userHtml);
            res.end();
        });
    }
    //Hiện thị danh sách Loại
    showFindProductByCategory = (req, res) =>{
        let html = '';
        fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.getProducts();
                html += `<div class="container">
                <div class="row ">`
                products.forEach((value) => {
                    html += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a href="/user/${value.id}"><button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button></a>
                </div>
                </div>
                </div>`
                })
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            let category = await this.getCategory();
            userHtml = userHtml.replace('{category}', category);
            userHtml = userHtml.replace('{products}', html);
            res.write(userHtml);
            res.end();
        });
    }

    //Hiện thị kết quả tìm kiếm theo Loại
    showResultFindProductByCategory = (req, res, id) =>{
        let html = '';
        fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.findProductByCategory(id);
                html += `<div class="container">
                <div class="row ">`
                products.forEach((value) => {
                    html += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a href="/user/${value.id}"><button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button></a>
                </div>
                </div>
                </div>`
                })
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            let category = await this.getCategory();
            userHtml = userHtml.replace('{category}', category);
            userHtml = userHtml.replace('{products}', html);
            res.write(userHtml);
            res.end();
        });
    }
}

module.exports = new ProductRouting();