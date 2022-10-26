const userRouting = require('./handler/userRouting');

const router = {
    'login' : userRouting.login,
    'register': userRouting.register,
    'admin': userRouting.admin,
    'user': userRouting.user
}

module.exports = router;