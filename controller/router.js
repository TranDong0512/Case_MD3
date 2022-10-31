const userRouting = require('./handler/userRouting');
const productRouting = require('./handler/productRouting');

const router = {
    'login' : userRouting.login,
    'register': userRouting.register,
    'admin': userRouting.admin,
    'admin/showAllProduct': productRouting.showAllProductAdmin,
    'admin/addProduct': productRouting.showAddProduct,
    'admin/editProduct': productRouting.showEditProduct,
    'admin/deleteProduct': productRouting.showDeleteProduct,
    'userShow' : productRouting.userShowAll,
    'admin/showAllOrder': productRouting.showAllOrder,
    'admin/deleteOrder': productRouting.deleteOrder,
    'user': userRouting.user,
    'user/findProductByName': productRouting.showFindProductByName,
    'user/findProductByPrice': productRouting.showFindProductByPrice,
    'user/findProductByCategory': productRouting.showFindProductByCategory,
    'user/resultFindProductByCategory': productRouting.showResultFindProductByCategory,
    'user/addProductToOrder': productRouting.showAddProductToOrder,
    'user/showCart': userRouting.showCart,
    'user/deleteProduct': userRouting.showDeleteProduct,
    'user/purchase': userRouting.buyProduct,
    'user/deleteCart': userRouting.deleteCart,
}

module.exports = router;