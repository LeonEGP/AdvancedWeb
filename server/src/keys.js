require("dotenv").config();
module.exports = {
    database: {
        host: process.env.HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.PASSWORD || 'itesm',
        database: process.env.DATABASE || 'test_database'
    }
}