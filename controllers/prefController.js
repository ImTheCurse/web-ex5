const { v4 } = require('uuid');
const uuid = v4;

exports.prefController = {

    //to sign up, use the key value of : "username": ..., "password":...
    async dbSignUpHandler(req, res) {

        const { dbConnection } = require('../db_connection');
        const connection = await dbConnection.createConnection();

        connection.execute(`insert into tbl_59_users(access_code,user_name,user_password) values('${uuid()}','${req.body.username}','${req.body.password}')`);

        connection.end();
        res.status(200).send('Successfuly inserted username and password.');
    }





}


