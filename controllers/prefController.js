const { v4 } = require('uuid');
const uuid = v4;

exports.prefController = {

    //to sign up, use the key value of : "username": ..., "password":...
    async dbSignUpHandler(req, res) {

        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();
        const access_code = uuid();
        connection.execute(`insert into tbl_59_users(access_code,user_name,user_password) values('${access_code}','${req.body.username}','${req.body.password}')`);

        connection.end();
        res.status(200).send(`Successfuly inserted username and password, your access code is: ${access_code} `);
    }







}


