const mysql = require('mysql')

class Connection {
    configToMySQL = {
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database:'',
        charset: 'utf8_general_ci'
    }
    getConnection(){
        return mysql.createConnection(this.configToMySQL)
    }
    connecting(){
        this.getConnection().connect(err =>{
            if(err){
                console.log(err);
            }else {
                console.log('sever running');
            }
        });
    }
}
let connection = new Connection();

module.exports = connection ;