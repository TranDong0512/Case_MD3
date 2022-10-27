const userRouting = require('./handler/userRouting');
const productRouting = require('./handler/productRouting');

const router = {
    'login' : userRouting.login,
    'register': userRouting.register,
    'admin': userRouting.admin,
    'admin/showAllProduct': productRouting.showAllProduct,
    'admin/addProduct': productRouting.showAddProduct,
    'admin/editProduct': productRouting.showEditProduct,
    'admin/deleteProduct': productRouting.showDeleteProduct,
    'user': userRouting.user,
    'user/findProductByName': productRouting.showFindProductByName,
    'user/findProductByPrice': productRouting.showFindProductByPrice,
    'user/findProductByCategory': productRouting.showFindProductByCategory,
    'user/resultFindProductByCategory': productRouting.showResultFindProductByCategory,
}

module.exports = router;