const mysql = require('mysql');

class Connection {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'quanlybanhang',
        charset: 'utf8_general_ci'
    });

    connecting() {
        this.connection.connect((err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Successful connection')
            }
        });
    }
}

module.exports = new Connection();